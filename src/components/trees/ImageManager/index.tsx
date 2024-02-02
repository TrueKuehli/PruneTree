import React, {useState, useRef, useEffect} from 'react';
import ReactCrop, {PercentCrop, PixelCrop} from 'react-image-crop';
import {toast} from 'react-toastify';

import database from '../../../common/scripts/database';
import {getImageUri, ImageURL, invalidateCropped} from '../../../common/scripts/dataUrl';
import Loading from '../../Loading';
import StorageQuotaBar from './StorageQuotaBar';

import 'react-image-crop/dist/ReactCrop.css';


type Props = {
  imagePreview: React.ReactNode,
  onImageChange: (image: number) => void,
  image: number,
  aspect: number,
}


/**
 * Compress an image file to reduce browser storage usage.
 * @param file The file to compress
 */
async function compressImage(file: File | Blob) {
  const {default: Compressor} = await import('compressorjs');

  return new Promise<Blob>((resolve, reject) => {
    new Compressor(file, {
      quality: 0.80,
      maxWidth: 1920,
      maxHeight: 1080,
      convertSize: 3_000_000,
      success(result) {
        resolve(result);
      },
      error(err) {
        reject(err);
      },
    });
  });
}


/**
 * The ImageManager component allows the user to upload and crop an image.
 * @param imagePreview The image preview component.
 * @param onImageChange The function to call when the image changes, sending the new database ID.
 * @param image The image ID in the database.
 * @param aspect The aspect ratio of the image.
 */
export default function ImageManager({imagePreview, onImageChange, image, aspect}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [percentCrop, setPercentCrop] = useState<PercentCrop>(null);
  const [cropImageUri, setCropImageUri] = useState<ImageURL>(null);

  // Handle storage quota here since we want to update it each time we change the image
  const [storageQuota, setStorageQuota] = useState<number>(null);
  const [storageUsage, setStorageUsage] = useState<number>(null);

  useEffect(() => {
    if (!(navigator?.storage?.estimate)) return;

    const estimatePromise = navigator?.storage?.estimate();
    if (estimatePromise) {
      estimatePromise.then((estimate) => {
        setStorageQuota(estimate.quota);
        setStorageUsage(estimate.usage);
      });
    }
  }, [image]);

  useEffect(() => {
    if (image) {
      database.getImageCrop(image)
        .then(setPercentCrop)
        .catch((err) => {
          toast.error(err?.message || 'Failed to get image crop data',
            {autoClose: false, toastId: `image-load-fail-${image}`});
        });

      getImageUri(image, false)
        .then(setCropImageUri)
        .catch((err) => {
          toast.error(err?.message || 'Failed to generate image URI',
            {autoClose: false, toastId: `image-load-fail-${image}`});
        });
    }
  }, [image]);

  /**
   * Show the file input to select an image
   * @param ev Click event from the upload image button
   */
  function selectImage(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    ev.preventDefault();
    fileRef.current.click();
  }

  /**
   * When a file is selected (a change on the file input) upload it to the IDB
   * @param ev File input change event
   */
  function fileSelected(ev: React.ChangeEvent<HTMLInputElement>) {
    ev.preventDefault();

    setUploading(true);

    const file = fileRef.current.files[0];
    const {type, size} = file;
    const acceptedFileTypes = ['image/png', 'image/jpeg'];

    if (!acceptedFileTypes.includes(type)) {
      toast.warn('File must be a JPG or PNG');
      return;
    }
    if (size > 25_000_000) {
      toast.warn('Files must be under 25MB in size before compression');
      return;
    }

    setPercentCrop(null);

    compressImage(file)
      .then(async (result) => {
        return await database.createImage(result);
      }).then((response) => {
        getImageUri(response._id as number)
          .then((uri) => {
            onImageChange(response._id as number);
            setCropImageUri(uri);
            setUploading(false);
          });
      }).catch((err) => {
        toast.error(err?.message || 'Failed to store image', {autoClose: false});
      });
  }

  /**
   * Updates the current crop, called as event on the Cropper Element.
   * @param _ Crop in pixels, not used since it corresponds to the dimensions of the element,
   *                   not the underlying image
   * @param percentCrop New crop selection in percent
   */
  function onCropChange(_: PixelCrop, percentCrop: PercentCrop) {
    setPercentCrop(percentCrop);
  }

  /**
   * Calculate the crop pixels and crop the image
   * @param e Click event from the crop image button
   */
  async function cropImage(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setCropping(true);

    const {default: Image} = await import('image-js');

    Image.load(cropImageUri.url)
      .then((image) => {
        if ((percentCrop === null) || (percentCrop.width === 0) || (percentCrop.height === 0) ||
            (percentCrop.x === 0 && percentCrop.y === 0 && percentCrop.width === 1 && percentCrop.height === 1)) {
          return image;
        }

        const cropX = Math.min(Math.round(percentCrop.x * image.width / 100), image.width);
        const cropY = Math.min(Math.round(percentCrop.y * image.height / 100), image.height);
        const cropWidth = Math.min(Math.round(percentCrop.width * image.width / 100), image.width - cropX);
        const cropHeight = Math.min(Math.round(percentCrop.height * image.height / 100), image.height - cropY);

        if (cropWidth < 1 || cropHeight < 1) {
          return image;
        }

        return image.crop({
          x: cropX,
          y: cropY,
          width: cropWidth,
          height: cropHeight,
        });
      })
      .then(async (cropped) => {
        return await cropped.toBlob(cropped.alpha ? 'image.png' : 'image/jpeg', 0.8);
      })
      .then(async (blob) => {
        return await database.updateCroppedImage(image, blob, percentCrop);
      })
      .then((response) => {
        setCropping(false);

        invalidateCropped(image);
        onImageChange(response._id as number);
        setShowCropper(false);
        toast.success('Image cropped');
      })
      .catch((err) => {
        toast.error(err?.message || 'Failed to crop image', {autoClose: false});
      });
  }

  /**
   * Hide the crop image UI
   */
  function cancelCrop() {
    setShowCropper(false);
  }


  if (showCropper) {
    return (
      uploading ? <Loading message='Uploading image...' /> :
      cropping ? <Loading message='Cropping image...' /> :

      <div>
        <ReactCrop
          crop={percentCrop}
          onChange={onCropChange}
          aspect={aspect}
        >
          <img src={cropImageUri.url} alt={'Image currently being cropped'}/>
        </ReactCrop>
        <div style={{textAlign: 'center'}}>
          <button className='btn btn-default' onClick={cancelCrop}>Cancel Crop</button>
          <button className='btn btn-primary' onClick={cropImage}>Crop Image</button>
        </div>
        <StorageQuotaBar storageQuota={storageQuota} storageUsage={storageUsage} />
      </div>
    );
  }

  return (
    <div style={{textAlign: 'center'}}>
      {imagePreview}
      <StorageQuotaBar storageQuota={storageQuota} storageUsage={storageUsage} />
      <button className='btn btn-link' style={{margin: 10}} onClick={selectImage}>
        Upload Image
      </button>
      <button className='btn btn-link' style={{margin: 10}} disabled={!image}
              onClick={() => setShowCropper(true)}>
        Crop Image
      </button>
      <button className='btn btn-link' style={{margin: 10}} disabled={!image}
              onClick={() => onImageChange(null)}>
        Delete Image
      </button>

      <input name='file' type='file' id='file' accept='.png,.jpg,.jpeg,image/png,image/jpeg' onChange={fileSelected}
             ref={fileRef} style={{display: 'none'}}/>
    </div>
  );
}
