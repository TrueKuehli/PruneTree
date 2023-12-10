/* eslint-disable */
// TODO: Re-Implement Image Uploads

/**
 * Images with no "avatar" or "cover" prefix a pre-migration so are held in the
 * original s3 uploads bucket. Otherwise, we can get them from the plum tree
 * domain as they are served from the API Gateway (resized).
 */
function getUploadedImageUri(image, dimensions) {
  // if (!image) return null
  //
  // const s3Host = 'https://s3-eu-west-1.amazonaws.com/plum-tree-uploads/'
  // const migratedHost = 'https://theplumtreeapp.com/uploads/'
  //
  // if (isMigratedImage(image)) {
  //   return dimensions ? `/api/upload/${dimensions}/${image}` : `${migratedHost}${image}`
  // }
  // return `${s3Host}${image}`
}

/**
 * Gets the original uploaded image URI (pre-processed original size)
 */
function getOrigUploadedImageUri(image) {
  // if (!image) return null
  //
  // const s3Host = 'https://s3-eu-west-1.amazonaws.com/plum-tree-uploads/'
  // const migratedHost = 'https://theplumtreeapp.com/uploads-orig/'
  //
  // return isMigratedImage(image) ? `${migratedHost}${image}` : `${s3Host}${image}`
}

export {
  getUploadedImageUri,
  getOrigUploadedImageUri,
};
