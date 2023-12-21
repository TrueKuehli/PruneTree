/**
 * Utility module for interfacing with the IndexedDB database used to store
 *   tree, people and image data
 */

import {parseID} from './utils';
import {Image, Person, Tree, DEFAULTS, ImagePercentCrop} from './types';


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
 * Helper function to performs a generic database request on any defined store
 * @param storeName Name of the object store to perform the action on
 * @param mode Mode to open the object store in
 * @param action Action to perform on the object store
 * @returns A promise that resolves with the result of the action on success, rejects on database error
 */
function performDatabaseRequest<Store extends DBStoreName, ActionReturnType>(
    storeName: Store,
    mode: 'readwrite' | 'readonly',
    action: (s: IDBObjectStore) => IDBRequest<ActionReturnType>,
): Promise<ActionReturnType> {
  return new Promise<ActionReturnType>((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = upgradeDatabase;

    request.onerror = (event) => {
      reject(event);
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([storeName], mode);
      const objectStore = transaction.objectStore(storeName);

      const request = action(objectStore);

      request.onerror = (event) => {
        reject(event);
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest<ActionReturnType>).result);
      };
    };
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
 * Helper function to get a specific element from the specified database store by ID
 * @param storeName Name of the object store to obtain the element from
 * @param id ID of the object to obtain
 * @returns Promise that resolves with the element on success, rejects on database error
 */
async function getElementFromDatabase<Store extends DBStoreName>(storeName: Store, id: number|string) {
  const parsedId = parseID(id);
  if (parsedId === null) {
    throw Error(`Invalid ${storeName} ID!`);
  }

  const result = await performDatabaseRequest(
      storeName,
      'readonly',
      (objectStore): IDBRequest<DB_STORE_TYPES[Store]> => objectStore.get(parsedId),
  );

  if (result === undefined) {
    throw Error(`ID ${parsedId.toString()} not found in ${storeName}!`);
  }
  return result;
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
    throw Error(`Invalid ${storeName} ID!`);
  }

  return await performDatabaseRequest(
      storeName,
      'readwrite',
      (objectStore): IDBRequest<undefined> => objectStore.delete(id),
  );
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
   * Deletes a tree from the database
   * @param treeId Database ID of the tree to delete
   * @returns Promise that resolves on success, rejects on database error
   */
  deleteTree: (treeId: number|string) => deleteFromDatabase('trees', treeId),

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

        return result.filter((person) => person.treeId === treeId);
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
  deletePerson: (personId: number|string) => deleteFromDatabase('people', personId),

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
  updateCroppedImage: (imageId: number|string, image: Blob|File, cropData: ImagePercentCrop) =>
    updateInDatabase('images', imageId, {cropped: image, cropData: cropData}),

  /**
   * Deletes an image from the database
   * @param imageId Database ID of the image to delete
   * @returns Promise that resolves on success, rejects on database error
   */
  deleteImage: (imageId: number|string) => deleteFromDatabase('images', imageId),
};
