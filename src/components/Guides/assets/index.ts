type Asset = {
  mp4?: string,
  webp?: string,
  jpg?: string,
};

type Assets = {
  [key: string]: Asset,
};


/* eslint-disable @typescript-eslint/no-require-imports */

export default {
  storagePersistence: {
    webp: require('./webp/storage-persistence.webp'),
    jpg: require('./jpg/storage-persistence.jpg'),
  },
  storageUsage: {
    webp: require('./webp/storage-usage.webp'),
    jpg: require('./jpg/storage-usage.jpg'),
  },
  createTree: {
    mp4: require('./mp4/create-tree.mp4'),
  },
  editTree: {
    mp4: require('./mp4/edit-tree.mp4'),
  },
  treeNode: {
    webp: require('./webp/tree-node.webp'),
    jpg: require('./jpg/tree-node.jpg'),
  },
  toolbarGif: {
    mp4: require('./mp4/tree-editor-toolbar.mp4'),
  },
  customTrait: {
    mp4: require('./mp4/custom-trait.mp4'),
  },
  simInfoPanel: {
    mp4: require('./mp4/sim-info-panel.mp4'),
  },
  setNodePerson: {
    mp4: require('./mp4/set-node-person.mp4'),
  },
  addPartner: {
    mp4: require('./mp4/add-partner.mp4'),
  },
  parents: {
    mp4: require('./mp4/parents.mp4'),
  },
  download: {
    mp4: require('./mp4/download.mp4'),
  },
  import: {
    mp4: require('./mp4/import.mp4'),
  },
  linkDetails: {
    mp4: require('./mp4/link-details.mp4'),
  },
  addLink: {
    mp4: require('./mp4/add-link.mp4'),
  },
} as Assets;

/* eslint-enable @typescript-eslint/no-require-imports */


export {
  Asset,
  Assets,
};
