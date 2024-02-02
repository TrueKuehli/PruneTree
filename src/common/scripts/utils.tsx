import React from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';


/**
 * Parses a string or number representing a database ID and returns it
 *   as a number or null if invalid
 * @param id The ID to parse
 * @returns The parsed ID or null if invalid
 */
function parseID(id: string|number): number|null {
  if (typeof id === 'string') {
    id = parseInt(id);
  }

  // Reject if ID is nan, not an integer, or less than 1
  if (isNaN(id) || !Number.isInteger(id) || id < 1) {
    return null;
  }

  return id;
}


/**
 * Requests storage persistence from the browser and notifies the user of the result. The result will be stored in
 *   localStorage so that we don't have to show the toast every time the user visits the site.
 */
function persistStorage() {
  // Try to persist storage
  const persistedBefore: string | null = localStorage.getItem('persisted');

  if (navigator.storage?.persist) {
    navigator.storage.persist().then((persisted) => {
      const persistedValue = String(persisted);
      // Only notify if the storage persistence has changed
      if (persistedValue === persistedBefore) return;

      if (persisted) {
        try {
          localStorage.setItem('persisted', 'true');
        } catch (e) {
          toast.error('Unable to store data in browser. Change your browser settings to allow website data ' +
            'or use a different browser.');
          return;
        }

        toast.info('Storage will not be cleared automatically by the browser.');
        toast.warn(
          'Clearing your browser data or switching to a new browser will delete all your trees!',
          {autoClose: false},
        );
      } else {
        try {
          localStorage.setItem('persisted', 'false');
        } catch (e) {
          toast.error('Unable to store data in browser. Change your browser settings to allow website data ' +
            'or use a different browser.');
          return;
        }

        toast.error(
          <>
            Storage may be cleared automatically by the browser. Learn more <Link to={'/guides/storage'}>here</Link>.
          </>, {autoClose: false},
      );
        toast.warn(
          'Clearing your browser data or switching to a new browser will also delete all your trees!',
          {autoClose: false},
        );
      }
    });
  }
}


/**
 * Registers a service worker for the website.
 */
function registerServiceWorker() {
  // Try to register service worker
  if ('serviceWorker' in navigator) {
    import('workbox-window').then(async ({Workbox}) => {
      const wb = new Workbox('/service-worker.js');

      // On update, notify the user that a new version is available
      wb.addEventListener('installed', (event) => {
        if (event.isUpdate) {
          const currentPath = window.location.hash.substring(1);
          toast.info(
            <>
              A new version of the app is available. <Link reloadDocument={true} to={currentPath}>
                Refresh the page</Link> to update, or <Link reloadDocument={true} to={'/version'}>learn more</Link>.
            </>,
            {autoClose: false},
          );
        }
      });

      await wb.register();
    });
  }
}


/**
 * Checks if an error is a QuotaExceededError.
 * @param e The error to check.
 */
function isQuotaExceededError(e: object): boolean {
  return e instanceof DOMException &&
    (e.code === 22 || // Everything except Firefox
      e.code === 1014 || // Firefox
      // Test name field too, since code is deprecated
      e.name === 'QuotaExceededError' || // Everything except Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED'); // Firefox
}

/**
 * Infer the MIME type of a file based on its extension.
 * Supported types:
 *   * image/apng
 *   * image/avif
 *   * image/bmp
 *   * image/gif
 *   * image/x-icon
 *   * image/jpeg
 *   * image/png
 *   * image/tiff
 *   * image/svg+xml
 *   * image/webp
 * @param filename The filename to infer the type of.
 * @returns The MIME type of the file or null if not a supported image type.
 */
function inferImageMimeType(filename: string): string {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'apng':
      return 'image/apng';
    case 'avif':
      return 'image/avif';
    case 'bmp':
      return 'image/bmp';
    case 'gif':
      return 'image/gif';
    case 'ico':
    case 'cur':
      return 'image/x-icon';
    case 'jpg':
    case 'jpeg':
    case 'jfif':
    case 'pjpeg':
    case 'pjp':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'tif':
    case 'tiff':
      return 'image/tiff';
    case 'svg':
      return 'image/svg+xml';
    case 'webp':
      return 'image/webp';
    default:
      return null;
  }
}

/**
 * Removes the _id property from an object.
 * @param obj The object to remove the _id property from.
 * @returns The object without the _id property.
 */
function omitId<T extends {_id?: IDBValidKey}>(obj: T): Omit<T, '_id'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {_id, ...rest} = obj;

  return rest;
}


export {
  parseID,
  persistStorage,
  registerServiceWorker,
  isQuotaExceededError,
  inferImageMimeType,
  omitId,
};
