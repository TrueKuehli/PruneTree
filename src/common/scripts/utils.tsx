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


export {
  parseID,
  persistStorage,
  isQuotaExceededError,
};
