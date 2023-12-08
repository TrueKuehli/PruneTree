/**
 * Util object for handling API calls as IndexedDB actions
 */

const DB_NAME = 'plumtree';
const DB_VERSION = 1;


const defaultTree = {
  title: 'New Tree',
  description: '',
  cover: null,
  data: {
    parents: [],
    partners: [],
  },
}

const defaultPerson = {
  treeId: -1,
  firstName: '',
  lastName: '',
  avatar: null,
  bio: '',

  parentType: 'NONE',
  parents: [],
  adoptiveParents: [],
  partners: [],
  links: [],

  traits: [],
  aspirations: [],
  lifeStates: [],
  custom: [],
}


/**
 * Creates the database and populate with some test data, used as update handler for onupgradeneeded event
 * @param event Database Event
 */
function upgradeDatabase(event) {
  const db = event.target.result;

  if (!db.objectStoreNames.contains('trees')) {
    const treesStore = db.createObjectStore('trees', { keyPath: '_id', autoIncrement: true });
    treesStore.createIndex('title', 'title', { unique: false });
    treesStore.createIndex('description', 'description', { unique: false });
    treesStore.createIndex('cover', 'cover', { unique: false });

    // TODO: Remove this once database is stable
    treesStore.transaction.oncomplete = (event) => {
      // Create some test objects
      const treeStore = db.transaction(['trees'], 'readwrite').objectStore('trees');

      treeStore.add({ title: 'Tree 1', ...defaultTree });
      treeStore.add({ title: 'Tree 2', ...defaultTree });
      treeStore.add({ title: 'Tree 3', ...defaultTree });
      treeStore.add({ title: 'Tree 4', ...defaultTree });
    }
  }

  if (!db.objectStoreNames.contains('people')) {
    const peopleStore = db.createObjectStore('people', { keyPath: '_id', autoIncrement: true });
    peopleStore.createIndex('treeId', 'treeId', { unique: false });
    peopleStore.createIndex('firstName', 'firstName', { unique: false });
    peopleStore.createIndex('lastName', 'lastName', { unique: false });

    // TODO: Remove this once database is stable
    peopleStore.transaction.oncomplete = (event) => {
      // Create some test objects
      const treeStore = db.transaction(['trees'], 'readwrite').objectStore('trees');

      treeStore.add({ title: 'Tree 1', ...defaultTree });
      treeStore.add({ title: 'Tree 2', ...defaultTree });
      treeStore.add({ title: 'Tree 3', ...defaultTree });
      treeStore.add({ title: 'Tree 4', ...defaultTree });

      // Create some test objects
      const peopleStore = db.transaction(['people'], 'readwrite').objectStore('people');

      peopleStore.add({ ...defaultPerson, treeId: 1 });
      peopleStore.add({ ...defaultPerson, treeId: 1 });
    }
  }
}


/**
 * Performs a generic database request
 * @param storeName {string} Name of the object store to perform the action on
 * @param mode {string} Mode to open the object store in
 * @param action {function(IDBObjectStore): IDBRequest} Action to perform on the object store
 * @returns {Promise<object>}
 */
function performDatabaseRequest(storeName, mode, action) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = upgradeDatabase;

    request.onerror = (event) => {
      reject(event);
    }

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], mode);
      const objectStore = transaction.objectStore(storeName);

      const request = action(objectStore);

      request.onerror = (event) => {
        reject(event);
      }

      request.onsuccess = (event) => {
        resolve({ data: event.target.result });
      }
    }
  });
}


/**
 * Gets all elements from a database store
 * @param storeName
 * @returns {Promise<Object>}
 */
function getAllFromDatabase(storeName) {
  return performDatabaseRequest(storeName, 'readonly', (objectStore) => objectStore.getAll());
}


/**
 * Gets an element from a database store by ID
 * @param storeName {string} Name of the object store to perform the action on
 * @param id {int|string} ID of the object to perform the action on
 * @returns {Promise<never>|Promise<unknown>}
 */
function getElementFromDatabase(storeName, id) {
  if (typeof id === 'string') {
    id = parseInt(id);
  }

  // Reject if ID is nan, not an integer, or less than 1
  if (isNaN(id) || !Number.isInteger(id) || id < 1) {
    return Promise.reject({ message: `Invalid ${storeName} ID!` });
  }

  return performDatabaseRequest(storeName, 'readonly', (objectStore) => objectStore.get(id))
    .then((result) => result.data ?
      Promise.resolve(result) :
      Promise.reject({ message: `ID ${id.toString()} not found in ${storeName}!` }));
}


/**
 * Inserts an element into a database store and returns the element with its new ID
 * @param storeName {string} Name of the object store to perform the action on
 * @param data {object} Data to insert into the database
 * @returns {Promise<unknown>} Promise that resolves with the inserted data on success, rejects on database error
 */
function insertIntoDatabase(storeName, data) {
  return performDatabaseRequest(storeName, 'readwrite', (objectStore) => objectStore.add(data))
    .then((result) => {
      return Promise.resolve({data: {...data, _id: result.data}});
    });
}


/**
 * Updates an element in a database store, overriding only passed keys
 * @param storeName {string} Name of the object store to perform the action on
 * @param id {int|string} ID of the object to perform the action on
 * @param data {object} Data to update in the database
 */
function updateInDatabase(storeName, id, data) {
  if (typeof id === 'string') {
    id = parseInt(id);
  }

  // Reject if ID is nan, not an integer, or less than 1
  if (isNaN(id) || !Number.isInteger(id) || id < 1) {
    return Promise.reject({ message: `Invalid ${storeName} ID!` });
  }

  return getElementFromDatabase(storeName, id)
    .then((result) => {
      const existingData = result.data;
      const updatedData = { ...existingData, ...data };

      return performDatabaseRequest(storeName, 'readwrite', (objectStore) => objectStore.put(updatedData))
        .then((result) => {
          return Promise.resolve({data: updatedData});
        });
    });
}


/**
 * Deletes an element from a database store
 * @param storeName {string} Name of the object store to perform the action on
 * @param id {int|string} ID of the object to perform the action on
 * @returns {Promise<unknown>} Promise that resolves on success, rejects on database error
 */
function deleteFromDatabase(storeName, id) {
  if (typeof id === 'string') {
    id = parseInt(id);
  }

  // Reject if ID is nan, not an integer, or less than 1
  if (isNaN(id) || !Number.isInteger(id) || id < 1) {
    return Promise.reject({ message: `Invalid ${storeName} ID!` });
  }

  return performDatabaseRequest(storeName, 'readwrite', (objectStore) => objectStore.delete(id));
}


export default {
  /**
   * Get all trees from the database
   * @returns {Promise} Promise that resolves with all trees on success, rejects on database error
   */
  getTrees: () => getAllFromDatabase('trees'),

  /**
   * Get a tree by ID
   * @param {int | string} id Tree ID
   * @returns {Promise} Promise that resolves with tree on success, rejects on database error or tree not found
   */
  getTree: (id) => getElementFromDatabase('trees', id),

  /**
   * Create a tree
   * @param {object} tree Tree object
   * @returns {Promise} Promise that resolves with tree on success, rejects on database error
   */
  createTree: (tree) => insertIntoDatabase('trees', {...defaultTree, ...tree}),

  /**
   * Update a tree
   * @param {int | string} treeId Tree ID
   * @param {object} tree Tree object (potentially incomplete)
   * @returns {Promise} Promise that resolves with tree on success, rejects on database error
   */
  updateTree: (treeId, tree) => updateInDatabase('trees', treeId, tree),

  /**
   * Delete a tree from the database
   * @param {int | string} treeId Tree ID
   * @returns {Promise} Promise that resolves on success, rejects on database error
   */
  deleteTree: (treeId) => deleteFromDatabase('trees', treeId),

  /**
   * Get all people corresponding to a given tree
   * @param {int | string} treeId Tree ID
   * @returns {Promise} Promise that resolves with all people on success, rejects on database error
   */
  getPeople: (treeId) => getAllFromDatabase('people').then((result) => {
    if (typeof treeId === 'string') {
      treeId = parseInt(treeId);
    }

    // Reject if ID is nan, not an integer, or less than 1
    if (isNaN(treeId) || !Number.isInteger(treeId) || treeId < 1) {
      return Promise.reject({ message: `Invalid tree ID!` });
    }

    return Promise.resolve({data: result.data.filter((person) => person.treeId === treeId)});
  }),

  /**
   * Get a person by ID
   * @param {int | string} personId Person ID
   * @returns {Promise} Promise that resolves with person on success, rejects on database error
   */
  getPerson: (personId) => getElementFromDatabase('people', personId),

  /**
   * Create a person
   * @param {object} person Person object
   * @returns {Promise} Promise that resolves with person on success, rejects on database error
   */
  createPerson: (person) => insertIntoDatabase('people', {...defaultPerson, ...person}),

  /**
   * Update a person
   * @param {int | string} personId Person ID
   * @param {object} person Person object (potentially incomplete)
   * @returns {Promise} Promise that resolves with person on success, rejects on database error
   */
  updatePerson: (personId, person) => updateInDatabase('people', personId, person),

  /**
   * Delete a person
   * @param {int | string} personId Person ID
   * @returns {Promise} Promise that resolves on success, rejects on database error
   */
  deletePerson: (personId) => {
    if (typeof personId === 'string') {
      personId = parseInt(personId);
    }

    // Reject if ID is nan, not an integer, or less than 1
    if (isNaN(personId) || !Number.isInteger(personId) || personId < 1) {
      return Promise.reject({message: 'Invalid person ID!'});
    }

    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = upgradeDatabase;

      request.onerror = (event) => {
        reject(event);
      }

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['people'], 'readwrite');
        const objectStore = transaction.objectStore('people');

        const deleteRequest = objectStore.delete(personId);
        deleteRequest.onerror = (event) => {
          reject(event);
        }
        deleteRequest.onsuccess = (event) => {
          resolve();
        }
      }
    });
  },
}