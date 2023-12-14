import database from '../../database/api'
import get from "lodash.get";
import {toast} from "react-toastify";


let generatedURLs = {
  'cropped': {},
  'original': {},
}

const dataURLRegistry = new FinalizationRegistry((image) => {
  generatedURLs[image.type][image.id] = undefined
  URL.revokeObjectURL(image.url)
})


/**
 * Creates an object containing the data URL of the given image ID and returns it
 * This container object is also cached as a weak reference as long as any strong references
 *   to this object exist
 * @param {string} image The image ID
 * @param {boolean} cropped Whether to get the cropped or original image
 * @returns {Promise<{url: string}>} The object containing the data URL
 */
const getImageUri = (image, cropped = true) => {
  const type = cropped ? 'cropped' : 'original'
  if (generatedURLs[type][image]) {
    if (generatedURLs[type][image].deref()) {
      return Promise.resolve(generatedURLs[type][image].deref())
    }
  }

  return (database.getImage(image)
    .then((result) => {
      const generatedURL = {url: URL.createObjectURL(result.data[type])}
      generatedURLs[type][image] = new WeakRef(generatedURL)
      dataURLRegistry.register(generatedURL,
        {id: image, url: generatedURL['url'], type: type})

      return generatedURL
    }).catch((err) => {
      toast.error(get(err, 'message', 'Failed to load image'))
      return null
    }))
}

/**
 * Invalidates the cache entry for the cropped version of a given image ID
 * @param {string} image The image ID
 */
function invalidateCropped(image) {
  generatedURLs['cropped'][image] = undefined
}

export {
  getImageUri,
  invalidateCropped,
}
