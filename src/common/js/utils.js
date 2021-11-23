/**
 * Images with no "avatar" or "cover" prefix a pre-migration so are held in the
 * original s3 uploads bucket. Otherwise we can get them from the plum tree
 * domain as they are served from the API Gateway (resized).
 */
const isMigratedImage = (image) => {
  if (!image) return false

  return image.startsWith('avatar/') || image.startsWith('cover/')
}

/**
 * Images with no "avatar" or "cover" prefix a pre-migration so are held in the
 * original s3 uploads bucket. Otherwise we can get them from the plum tree
 * domain as they are served from the API Gateway (resized).
 */
const getUploadedImageUri = (image, dimensions) => {
  if (!image) return null

  const s3Host = 'https://s3-eu-west-1.amazonaws.com/plum-tree-uploads/'
  const migratedHost = 'https://theplumtreeapp.com/uploads/'

  if (isMigratedImage(image)) {
    return dimensions ? `/api/upload/${dimensions}/${image}` : `${migratedHost}${image}`
  }
  return `${s3Host}${image}`
}

/**
 * Gets the original uploaded image URI (pre-processed original size)
 */
const getOrigUploadedImageUri = (image) => {
  if (!image) return null

  const s3Host = 'https://s3-eu-west-1.amazonaws.com/plum-tree-uploads/'
  const migratedHost = 'https://theplumtreeapp.com/uploads-orig/'

  return isMigratedImage(image) ? `${migratedHost}${image}` : `${s3Host}${image}`
}

/**
 * Checks an email string is valid.
 */
const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

const sendGoogleAnalyticsPageView = page => {
  if (window.ga) {
    window.ga('set', 'page', location.pathname + location.search)
    window.ga('send', 'pageview')
  }
}

export {
  isMigratedImage,
  getUploadedImageUri,
  getOrigUploadedImageUri,
  isValidEmail,
  sendGoogleAnalyticsPageView
}
