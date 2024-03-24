import {toast} from 'react-toastify';
import type * as zip from '@zip.js/zip.js';

import {BundledTree, DEFAULTS, Image, Person, Tree} from './types';
import {LEGACY_PARENT_TYPES} from './conceptionTypes';
import {LEGACY_PARTNER_TYPES} from './partnerTypes';
import {inferImageMimeType} from './utils';
import database from './database';

import tragicClown from '../images/tragic-clown.jpg';


/**
 * Import a Prune Tree backup ZIP archive into the database
 * @param bundle The backup ZIP archive
 * @param zipContent The entries of the backup ZIP archive
 */
async function importPrune(bundle: zip.Entry, zipContent: zip.Entry[]) {
  const zip = await import('@zip.js/zip.js');

  const jsonWriter = new zip.TextWriter();
  const jsonData = await bundle.getData(jsonWriter);
  const tree: BundledTree = JSON.parse(jsonData);

  // Load all images from zip file and place them into the bundled tree structure
  const imagePlaceholder = await (await fetch(tragicClown)).blob();
  for (const image of tree.images) {
    const originalEntry = zipContent.find((entry) => entry.filename.startsWith(`original/${image._id}`));
    const croppedEntry = zipContent.find((entry) => entry.filename.startsWith(`cropped/${image._id}`));

    let originalBlob: Blob;
    const originalMimeType = inferImageMimeType(originalEntry.filename);
    if (!originalEntry || !originalMimeType) {
      toast.warn('Backup ZIP archive is missing some (valid) image files',
        {autoClose: false, toastId: 'backup-missing-images'});
      originalBlob = imagePlaceholder;
    } else {
      originalBlob = await originalEntry.getData(new zip.BlobWriter(originalMimeType));
    }

    let croppedBlob: Blob;
    const croppedMimeType = inferImageMimeType(croppedEntry.filename);
    if (!croppedEntry || !croppedMimeType) {
      toast.warn('Backup ZIP archive is missing some (valid) image files',
        {autoClose: false, toastId: 'backup-missing-images'});
      croppedBlob = imagePlaceholder;
    } else {
      croppedBlob = await croppedEntry.getData(new zip.BlobWriter(croppedMimeType));
    }

    image.original = originalBlob;
    image.cropped = croppedBlob;
  }

  // Import the tree into the database
  return await database.importBundledTree(tree);
}


/**
 * Import a Plum Tree backup ZIP archive into the database
 * @param treeEntry The tree entry of the backup ZIP archive
 * @param peopleEntry The people entry of the backup ZIP archive
 * @param zipContent The entries of the backup ZIP archive
 */
async function importPlum(treeEntry: zip.Entry, peopleEntry: zip.Entry, zipContent: zip.Entry[]) {
  const zip = await import('@zip.js/zip.js');

  const treeJsonWriter = new zip.TextWriter();
  const treeJsonData = (await treeEntry.getData(treeJsonWriter))
    .replace('var tree=', '');
  const tree: Tree = JSON.parse(treeJsonData);

  // Recursively map legacy properties to new properties
  const nodesToUpdate = [tree.data];
  while (nodesToUpdate.length > 0) {
    const node = nodesToUpdate.pop();
    node.parentType = LEGACY_PARENT_TYPES[node.parentType] || node.parentType || LEGACY_PARENT_TYPES.NONE;

    node.partners = node.partners?.map((partnerData) => ({
      ...partnerData,
      type: LEGACY_PARTNER_TYPES[partnerData.type] || partnerData.type || LEGACY_PARTNER_TYPES.PARTNER,
    })) || [];

    if (node.children) nodesToUpdate.push(...node.children);
  }

  const peopleJsonWriter = new zip.TextWriter();
  const peopleJsonData = (await peopleEntry.getData(peopleJsonWriter))
    .replace('var people=', '');
  const peopleData: (Omit<Person, 'treeId'> & {tree: string})[] = JSON.parse(peopleJsonData);

  const people = peopleData.map((person) => ({
    ...person,
    treeId: person.tree,
  })) satisfies Person[];

  // Load all images from zip file and register them
  const images: Image[] = [];
  for (const imageEntry of zipContent.filter((entry) => entry.filename.startsWith('images/'))) {
    const id = imageEntry.filename.replace('images/', '');

    const originalMimeType = inferImageMimeType(id);
    if (!originalMimeType) {
      // This may not be a valid image file, so we skip it
      continue;
    }

    const imageBlob = await imageEntry.getData(new zip.BlobWriter(originalMimeType));

    images.push({
      ...DEFAULTS.IMAGE,
      _id: id,
      original: imageBlob,
      cropped: imageBlob,
    });
  }

  // Import the tree into the database
  return await database.importBundledTree({
    tree,
    people,
    images,
  });
}


/**
 * Import a backup ZIP archive into the database
 * @param bundle The backup ZIP archive; can be either in prune format or in original Plum Tree format
 */
async function importBackup(bundle: File) {
  const {type} = bundle;
  const acceptedFileTypes = ['application/zip', 'application/x-zip-compressed'];

  if (!acceptedFileTypes.includes(type)) {
    toast.warn('File must be a Backup ZIP archive.');
    return null;
  }

  const zip = await import('@zip.js/zip.js');
  console.log(zip);


  const reader = new zip.BlobReader(bundle);
  const zipReader = new zip.ZipReader(reader);
  const zipEntries = await zipReader.getEntries();

  const jsonEntry = zipEntries.find((entry) => entry.filename === 'bundle.json');
  if (jsonEntry) {
    // Image is in Prune Tree format
    return importPrune(jsonEntry, zipEntries);
  }

  const treeEntry = zipEntries.find((entry) => entry.filename === 'data/tree.js');
  const peopleEntry = zipEntries.find((entry) => entry.filename === 'data/people.js');
  if (treeEntry && peopleEntry) {
    // Image is in original Plum Tree format
    return importPlum(treeEntry, peopleEntry, zipEntries);
  }

  toast.error(
    `File "${bundle.name}" does not look like a valid backup, make sure you selected the correct file`,
    {autoClose: false},
  );
  return null;
}


/**
 * Export a tree backup ZIP archive from the database
 * @param treeId The ID of the tree to export
 */
async function exportBackup(treeId: number | string) {
  const bundle = await database.getTreeBundled(treeId);

  const zip = await import('@zip.js/zip.js');

  const zipFileWriter = new zip.BlobWriter();
  const zipWriter = new zip.ZipWriter(zipFileWriter);

  // Add tree data, this ignores any file blobs!
  await zipWriter.add('bundle.json', new zip.TextReader(JSON.stringify(bundle)));

  // Add all blobs
  const promises = [];
  bundle.images.forEach((image) => {
    const name = image.cropped.type == 'image/png' ? `${image._id}.png` :
      (image.cropped.type == 'image/jpeg' ? `${image._id}.jpg` : `${image._id}`);

    promises.push(zipWriter.add(`original/${name}`, new zip.BlobReader(image.original)));
    promises.push(zipWriter.add(`cropped/${name}`, new zip.BlobReader(image.cropped)));
  });

  // Wait for all blobs to be added
  await Promise.all(promises);

  // Close the zip
  const zipFileBlob = await zipWriter.close();

  const filename = (bundle.tree.title || 'Untitled Tree')
    .slice(0, 32)
    .replace(/[^a-z0-9\-_]+/gi, '_')
    .toLowerCase() + '.zip';

  // Create "a" HTML element with href to file & click
  const link = document.createElement('a');
  link.href = URL.createObjectURL(zipFileBlob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();

  // Clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  toast.success('Download started');
}


export {
  importBackup,
  exportBackup,
};
