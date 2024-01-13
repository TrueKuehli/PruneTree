/**
 * Utility module for interfacing with the IndexedDB database used to store
 *   tree, people and image data
 */

import {PercentCrop} from 'react-image-crop';

import {isQuotaExceededError, parseID, omitId} from './utils';
import {Image, Person, Tree, DEFAULTS, BundledTree} from './types';


const DB_NAME = 'prunetree';
const DB_VERSION = 2;

const DB_STORE_NAMES = ['trees', 'people', 'images'] as const;
type DB_STORE_TYPES = {
  'trees': Tree,
  'people': Person,
  'images': Image,
};
type DBStoreName = typeof DB_STORE_NAMES[number];


/**
 * Creates the database, used as update handler for onupgradeneeded event
 * IMPORTANT: When breaking changes are introduced, they have to be handled here!
 * @private Only to be used for database onupgradeneeded event
 * @param event The event object passed by the event handler
 */
function upgradeDatabase(event: IDBVersionChangeEvent): void {
  const db = (event.target as IDBOpenDBRequest).result;

  if (!db.objectStoreNames.contains('trees')) {
    const treesStore = db.createObjectStore('trees', {keyPath: '_id', autoIncrement: true});
    treesStore.createIndex('title', 'title', {unique: false});
  }

  if (!db.objectStoreNames.contains('people')) {
    const peopleStore = db.createObjectStore('people', {keyPath: '_id', autoIncrement: true});
    peopleStore.createIndex('treeId', 'treeId', {unique: false});
    peopleStore.createIndex('firstName', 'firstName', {unique: false});
    peopleStore.createIndex('lastName', 'lastName', {unique: false});
  }

  if (!db.objectStoreNames.contains('images')) {
    db.createObjectStore('images', {keyPath: '_id', autoIncrement: true});
  }
}


/**
 * Event handler for database errors
 * @param event The event object passed by the event handler
 * @param reject The reject function of the promise that should be rejected
 */
function onDatabaseError(event: Event, reject: (reason?: Error) => void) {
  if (isQuotaExceededError((event.target as IDBRequest).error)) {
    reject(new Error('Your browser\'s storage quota has been exceeded!'));
    return;
  }
  reject((event.target as IDBRequest).error);
}


/**
 * Helper function to open the database
 * @returns Promise that resolves with the database on success, rejects on database error
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = upgradeDatabase;
    request.onerror = (event) => onDatabaseError(event, reject);

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
  });
}


/**
 * Helper function to perform a generic database request on any defined store
 * @param storeName Name of the object store to perform the action on
 * @param mode Mode to open the object store in
 * @param action Action to perform on the object store
 * @returns A promise that resolves with the result of the action on success, rejects on database error
 */
async function performDatabaseRequest<Store extends DBStoreName, ActionReturnType>(
  storeName: Store,
  mode: 'readwrite' | 'readonly',
  action: (s: IDBObjectStore) => IDBRequest<ActionReturnType>,
): Promise<ActionReturnType> {
  const db = await openDatabase();
  return await new Promise<ActionReturnType>((resolve, reject) => {
    const transaction = db.transaction([storeName], mode);
    const objectStore = transaction.objectStore(storeName);

    // Instead of returning in request onsuccess, we need to store the result in a variable
    //   so that we can wait if the transaction was successful
    let transactionResult: ActionReturnType = null;

    // Handle transaction issues
    transaction.onerror = (event) => onDatabaseError(event, reject);
    transaction.onabort = (event) => onDatabaseError(event, reject);
    transaction.oncomplete = () => {
      resolve(transactionResult);
    };

    const request = action(objectStore);

    request.onerror = (event) => onDatabaseError(event, reject);
    request.onsuccess = (event) => {
      transactionResult = (event.target as IDBRequest<ActionReturnType>).result;
    };
  });
}


/**
 * Helper function to perform a database request with multiple actions on any defined store
 * @param storeName Name of the object store to perform the action on
 * @param mode Mode to open the object store in
 * @param actions Actions to perform on the object store
 * @returns A promise that resolves with the result of the action on success, rejects on database error
 */
async function performDatabaseMultiRequest<Store extends DBStoreName, ActionReturnType>(
  storeName: Store,
  mode: 'readwrite' | 'readonly',
  actions: (s: IDBObjectStore) => IDBRequest<ActionReturnType>[],
): Promise<ActionReturnType[]> {
  const db = await openDatabase();
  return new Promise<ActionReturnType[]>((resolve, reject) => {
    const transaction = db.transaction([storeName], mode);
    const objectStore = transaction.objectStore(storeName);

    // Instead of returning in request onsuccess, we need to store the result in a variable
    //   so that we can wait if the transaction was successful
    const transactionResults: ActionReturnType[] = [];

    // Handle transaction issues
    transaction.onerror = (event) => onDatabaseError(event, reject);
    transaction.onabort = (event) => onDatabaseError(event, reject);
    transaction.oncomplete = () => {
      resolve(transactionResults);
    };

    const requests = actions(objectStore);

    requests.map((r) => {
      r.onerror = (event) => onDatabaseError(event, reject);
      r.onsuccess = (event) => {
        transactionResults.push((event.target as IDBRequest<ActionReturnType>).result);
      };
    });
  });
}


/**
 * Helper function to get all elements from a specified database store
 * @param storeName Name of the object store
 * @returns Promise that resolves with all elements on success, rejects on database error
 */
function getAllFromDatabase<Store extends DBStoreName>(storeName: Store) {
  return performDatabaseRequest(
      storeName,
      'readonly',
      (objectStore): IDBRequest<DB_STORE_TYPES[Store][]> => objectStore.getAll(),
  );
}


/**
 * Helper function to get all IDs from a specified database store without loading the actual data
 * @param storeName
 */
function getAllIdsFromDatabase<Store extends DBStoreName>(storeName: Store) {
  return performDatabaseRequest(
      storeName,
      'readonly',
      (objectStore): IDBRequest<IDBValidKey[]> => objectStore.getAllKeys(),
  );
}


/**
 * Helper function to get a specific element from the specified database store by ID
 * @param storeName Name of the object store to obtain the element from
 * @param id ID of the object to obtain
 * @returns Promise that resolves with the element on success, rejects on database error
 */
async function getElementFromDatabase<Store extends DBStoreName>(storeName: Store, id: number|string) {
  const parsedId = parseID(id);
  if (parsedId === null) {
    throw new Error(`Invalid ${storeName} ID!`);
  }

  const result = await performDatabaseRequest(
      storeName,
      'readonly',
      (objectStore): IDBRequest<DB_STORE_TYPES[Store]> => objectStore.get(parsedId),
  );

  if (result === undefined) {
    throw new Error(`ID ${parsedId.toString()} not found in ${storeName}!`);
  }
  return result;
}


/**
 * Helper function to get multiple specific elements from the specified database store by ID.
 * Does not handle invalid IDs!
 * @param storeName Name of the object store to obtain the element from
 * @param ids IDs of the objects to obtain
 * @returns Promise that resolves with the element on success, rejects on database error
 */
async function getElementsFromDatabase<Store extends DBStoreName>(storeName: Store, ids: (number|string)[]) {
  const parsedIds = ids.map((id) => parseID(id));

  return await performDatabaseMultiRequest(
    storeName,
    'readonly',
    (objectStore): IDBRequest<DB_STORE_TYPES[Store]>[] =>
      parsedIds.map((id) => objectStore.get(id)),
  );
}


/**
 * Helper function to insert an element into the specified database store
 * @param storeName Name of the object store to insert element into
 * @param data Data to insert into the database
 * @returns Promise that resolves with the inserted data including the newly assigned ID on success,
 *          rejects on database error
 */
async function insertIntoDatabase<Store extends DBStoreName>(storeName: Store, data: DB_STORE_TYPES[Store]) {
  const result = await performDatabaseRequest(
      storeName,
      'readwrite',
      (objectStore): IDBRequest<number> => objectStore.add(data) as IDBRequest<number>,
  );
  return ({...data, _id: result} as DB_STORE_TYPES[Store]);
}


/**
 * Helper function to update an element in the specified database store
 * @param storeName Name of the object store to update the element in
 * @param id ID of the object to update
 * @param data Data to update the object with, can be incomplete
 * @returns Promise that resolves with the updated object on success, rejects on database error
 */
async function updateInDatabase<Store extends DBStoreName>(
    storeName: Store,
    id: number|string,
    data: Partial<DB_STORE_TYPES[Store]>,
) {
  const existingData: DB_STORE_TYPES[Store] = await getElementFromDatabase(storeName, id);
  const updatedData: DB_STORE_TYPES[Store] = {...existingData, ...data};

  await performDatabaseRequest(
      storeName,
      'readwrite',
      (objectStore): IDBRequest<IDBValidKey> => objectStore.put(updatedData),
  );
  return updatedData;
}


/**
 * Helper function to delete an element from the specified database store
 * @param storeName Name of the object store to delete the element from
 * @param id ID of the object to delete
 * @returns Promise that resolves on success, rejects on database error
 */
async function deleteFromDatabase<Store extends DBStoreName>(storeName: Store, id: number|string) {
  const parsedId = parseID(id);
  if (parsedId === null) {
    throw new Error(`Invalid ${storeName} ID!`);
  }

  return await performDatabaseRequest(
      storeName,
      'readwrite',
      (objectStore): IDBRequest<undefined> => objectStore.delete(id),
  );
}


/**
 * Helper function to delete multiple elements from the specified database store
 * @param storeName Name of the object store to delete the element from
 * @param ids ID of the objects to delete
 * @returns Promise that resolves on success, rejects on database error
 */
async function deleteMultipleFromDatabase<Store extends DBStoreName>(storeName: Store, ids: (number|string)[]) {
  const parsedIds = ids.map(parseID).filter((id) => id !== null);
  if (parsedIds.length === 0) {
    return Promise.resolve<undefined>(undefined);
  }

  return (await performDatabaseMultiRequest(
    storeName,
    'readwrite',
    (objectStore): IDBRequest<undefined>[] => parsedIds.map((id) => objectStore.delete(id)),
  ))[0];
}


export default {
  /**
   * Gets all trees from the database
   * @returns Promise that resolves with all trees on success, rejects on database error
   */
  getTrees: () => getAllFromDatabase('trees'),

  /**
   * Gets a tree from the database by ID
   * @param treeId Tree ID
   * @returns Promise that resolves with tree on success, rejects on database error or tree not found
   */
  getTree: (treeId: number|string) => getElementFromDatabase('trees', treeId),

  /**
   * Creates a tree in the database with the given data
   * @param tree Tree object to insert into the database
   * @returns Promise that resolves with tree on success, rejects on database error
   */
  createTree: (tree: Partial<Tree>) => insertIntoDatabase('trees', {...DEFAULTS.TREE, ...tree}),

  /**
   * Updates a tree in the database with the given data
   * @param treeId Database ID of the tree to update
   * @param tree Tree object (can be incomplete)
   * @returns Promise that resolves with the updated tree on success, rejects on database error
   */
  updateTree: (treeId: number|string, tree: Partial<Tree>) => updateInDatabase('trees', treeId, tree),

  /**
   * Deletes a tree from the database, this also removes all associated people and images
   * @param treeId Database ID of the tree to delete
   * @returns Promise that resolves on success, rejects on database error
   */
  deleteTree: async (treeId: number | string) => {
    const treeRequest = getElementFromDatabase('trees', treeId);
    const peopleRequest = getAllFromDatabase('people');
    const imagesRequest = getAllIdsFromDatabase('images');

    const [tree, people, images] = await Promise.all([treeRequest, peopleRequest, imagesRequest]);

    // Find people belonging to the tree
    const treePeople = people.filter((person) =>
      person.treeId === treeId,
    );
    const treePeopleIds = treePeople.map((person) => person._id as number);

    // Find images belonging to the tree or the people inside
    const treeImageIds = images.filter((image) =>
      tree.cover === image ||
      treePeople.some((person) => person.avatar === image),
    ) as (string|number)[];

    // Perform deletions
    const treeDeletion = deleteFromDatabase('trees', treeId);
    const peopleDeletion = deleteMultipleFromDatabase('people', treePeopleIds);
    const imagesDeletion = deleteMultipleFromDatabase('images', treeImageIds);
    return Promise.all([
      treeDeletion,
      peopleDeletion,
      imagesDeletion,
    ]);
  },

  /**
   * Gets all people corresponding to a given tree from the database
   * @param treeId Database ID of the tree to get people for
   * @returns Promise that resolves with all people corresponding to the tree on success, rejects on database error
   */
  getPeople: (treeId: number|string) => getAllFromDatabase('people')
      .then(async (result) => {
        const parsedId = parseID(treeId);
        if (parsedId === null) {
          throw Error('Invalid tree ID!');
        }

        return result.filter((person) => person.treeId === parsedId);
      }),

  /**
   * Gets a person by their ID
   * @param personId Database ID of the person to get
   * @returns Promise that resolves with person on success, rejects on database error
   */
  getPerson: (personId: number|string) => getElementFromDatabase('people', personId),

  /**
   * Creates a person in the database from the given data
   * @param person Person object to insert into the database (can be incomplete)
   * @returns Promise that resolves with the inserted person on success, rejects on database error
   */
  createPerson: (person: Partial<Person>) => insertIntoDatabase('people', {...DEFAULTS.PERSON, ...person}),

  /**
   * Updates a person in the database with the given data
   * @param personId Database ID of the person to update
   * @param person Person object (can be incomplete)
   * @returns Promise that resolves with updated person on success, rejects on database error
   */
  updatePerson: (personId: number|string, person: Partial<Person>) => updateInDatabase('people', personId, person),

  /**
   * Deletes a person from the database
   * @param personId Database ID of the person to delete
   * @returns Promise that resolves on success, rejects on database error
   */
  deletePerson: async (personId: number|string) => {
    const person = await getElementFromDatabase('people', personId);

    // Delete the person's avatar image if it exists
    if (person.avatar) {
      try {
        await deleteFromDatabase('images', person.avatar);
      } catch (err) {
        /* Ignore promise rejection, avatar most likely does not exist */
      }
    }

    return await deleteFromDatabase('people', personId);
  },

  /**
   * Gets an image from the database by ID
   * @param imageId Database ID of the image to get
   * @returns Promise that resolves with the image entry on success, rejects on database error
   */
  getImage: (imageId: number|string) => getElementFromDatabase('images', imageId),

  /**
   * Gets the crop data for an image from the database by ID
   * @param imageId Database ID of the image to get crop data for
   * @returns Promise that resolves with crop data on success, rejects on database error
   */
  getImageCrop: (imageId: number|string) => getElementFromDatabase('images', imageId)
      .then((result) => result.cropData),

  /**
   * Creates a new database entry for a given image blob
   * @param image Image blob
   * @returns Promise that resolves with image entry on success, rejects on database error
   */
  createImage: (image: Blob|File) => insertIntoDatabase('images',
      {...DEFAULTS.IMAGE, original: image, cropped: image}),

  /**
   * Updates the cropped version of an image in the database
   * @param imageId Database ID of the image to update
   * @param image The file blob containing the new cropped image
   * @param cropData The updated crop data
   * @returns Promise that resolves with updated image entry on success, rejects on database error
   */
  updateCroppedImage: (imageId: number|string, image: Blob|File, cropData: PercentCrop) =>
    updateInDatabase('images', imageId, {cropped: image, cropData: cropData}),

  /**
   * Deletes an image from the database
   * @param imageId Database ID of the image to delete
   * @returns Promise that resolves on success, rejects on database error
   */
  deleteImage: (imageId: number|string) => deleteFromDatabase('images', imageId),

  /**
   * Deletes multiple images from the database
   * @param imageIds Database IDs of the images to delete
   * @returns Promise that resolves on success, rejects on database error
   */
  deleteImages: (imageIds: (number|string)[]) => deleteMultipleFromDatabase('images', imageIds),

  /**
   * Gets all data associated with a tree from the database
   * @param treeId Database ID of the tree to get data for
   * @returns Promise that resolves with bundled {tree, people, images} on success, rejects on database error
   */
  getTreeBundled: async (treeId: number|string) => {
    const parsedId = parseID(treeId);
    const tree = await getElementFromDatabase('trees', treeId);
    const people = await getAllFromDatabase('people');

    const treePeople = people.filter((person) =>
      person.treeId === parsedId,
    );

    const allImages = await getAllIdsFromDatabase('images');
    const imageIds = allImages.filter((image) =>
      treePeople.some((person) => person.avatar === image) ||
      tree.cover === image,
    ) as (string|number)[];

    const images = await getElementsFromDatabase('images', imageIds);

    return {
      tree: tree,
      people: treePeople,
      images: images,
    } as BundledTree;
  },

  /**
   * Imports a bundled tree into the database
   * @param tree Tree data to import, typically passed as part of a BundledTree object
   * @param people People data to import, typically passed as part of a BundledTree object
   * @param images Image data to import, typically passed as part of a BundledTree object
   * @returns Promise that resolves with the updated tree on success, rejects on database error
   */
  importBundledTree: async ({tree, people, images}: BundledTree) => {
    const newTree = await insertIntoDatabase('trees', DEFAULTS.TREE);

    // Insert images and create a map of old IDs to new IDs
    const newImages = await Promise.all(images.map(async (image) => ({
      oldId: image._id as number,
      newElement: await insertIntoDatabase('images', {
        ...DEFAULTS.IMAGE,
        ...omitId(image),
      }),
    })));
    const imageIdMap = newImages.reduce((acc, cur) => {
      acc[cur.oldId] = cur.newElement._id;
      return acc;
    }, {} as Map<number, number>);

    // Insert people, updating their image IDs and tree ID
    const newPeople = await Promise.all(people.map(async (person) => ({
      oldId: person._id as number,
      newElement: await insertIntoDatabase('people', {
        ...DEFAULTS.PERSON,
        ...omitId(person),
        treeId: newTree._id as number,
        avatar: person.avatar !== null ? imageIdMap[person.avatar] : null,
      }),
    })));
    const peopleIdMap = newPeople.reduce((acc, cur) => {
      acc[cur.oldId] = cur.newElement._id;
      return acc;
    }, {} as Map<number, number>);

    // Update tree with new IDs
    tree._id = newTree._id;
    tree.cover = tree.cover !== null ? imageIdMap[tree.cover] : null;

    // Recursively update tree data with new IDs
    const nodesToUpdate = [tree.data];
    while (nodesToUpdate.length > 0) {
      const node = nodesToUpdate.pop();
      node.parents = node.parents?.map((parent) => ({
        _id: peopleIdMap[parent._id as number],
      })) || [];
      node.adoptiveParents = node.adoptiveParents?.map((parent) => ({
        _id: peopleIdMap[parent._id as number],
      })) || [];
      node.partners = node.partners?.map((partnerData) => ({
        ...partnerData,
        people: partnerData.people?.map((partner) => ({
          _id: peopleIdMap[partner._id as number],
        })) || [],
      })) || [];
      node.person = {
        _id: !node.person?._id ? null : peopleIdMap[node.person._id as number],
      };

      nodesToUpdate.push(...node.children);
    }

    // Update tree in database
    await updateInDatabase('trees', tree._id as number, omitId(tree));

    return tree;
  },
};
