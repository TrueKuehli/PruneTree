/**
 * Utility module to produce and cache data URLs for images, which are automatically
 *   revoked when no longer in use
 */

import {toast} from 'react-toastify';
import get from 'lodash.get';

import {parseID} from './utils';
import database from './database';


type ImageType = 'cropped' | 'original'
type ImageURL = {url: string}
type CachedImage = WeakRef<ImageURL>
type FinalizationCallbackHeldValue = {id: number, url: string, type: ImageType}


// Used to cache the data URLs of images while they are still in use by some part of the program
const URL_CACHE: {[K in ImageType]: {[key:number]: CachedImage}} = {
  'cropped': {},
  'original': {},
};

// Used to revoke URLs no longer in use by any part of the application
const URL_FIN_REGISTRY = new FinalizationRegistry<FinalizationCallbackHeldValue>(
    (image) => {
      URL_CACHE[image.type][image.id] = undefined;
      URL.revokeObjectURL(image.url);
    });


/**
 * Creates an object containing the data URL of the given image ID and returns it
 * This container object is also cached as a weak reference as long as any strong references
 *   to this object exist
 * @param image The database ID of the image to get the data URL of
 * @param cropped Whether to get the cropped or original version of the image
 * @returns A promise that resolves to an object containing the data URL of the image. This object
 *   should be stored as long as the URL is needed, as the underlying data URL will be revoked
 *   when no longer in use.
 */
function getImageUri(image: number|string, cropped: boolean = true): Promise<ImageURL> {
  const id = parseID(image);
  const type = cropped ? 'cropped' : 'original';
  if (URL_CACHE[type][id]) {
    if (URL_CACHE[type][id].deref()) {
      return Promise.resolve(URL_CACHE[type][id].deref());
    }
  }

  return (database.getImage(id)
      .then((result) => {
        const generatedURL = {url: URL.createObjectURL(result[type])};
        URL_CACHE[type][id] = new WeakRef(generatedURL);
        URL_FIN_REGISTRY.register(generatedURL,
            {id: id, url: generatedURL['url'], type: type});

        return generatedURL;
      }).catch((err: Error) => {
        toast.error(err?.message || 'Failed to load image');
        return {url: ''};
      }));
}


/**
 * Invalidates the cache entry for the cropped version of a given image ID
 * @param image The database ID of the image to invalidate the cache entry for
 */
function invalidateCropped(image: number|string) {
  const id = parseID(image);
  URL_CACHE['cropped'][id] = undefined;
}


export {
  ImageURL,
  getImageUri,
  invalidateCropped,
};
