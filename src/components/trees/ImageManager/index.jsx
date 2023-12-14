import React, {useState, useRef, useEffect} from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import get from 'lodash.get'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Loading from '../../Loading'
import {getImageUri, invalidateCropped} from '../../../common/js/utils'
import database from '../../../database/api'
import Compressor from "compressorjs";
import Image from "image-js";
import styles from "../TreeEditor/styles.scss";


function compressImage(file) {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.80,
      maxWidth: 1920,
      maxHeight: 1080,
      convertSize: 3_000_000,
      drew(context, canvas) {
        // canvas.width = Math.floor(canvas.width / 2);
        // canvas.height = Math.floor(canvas.height / 2);
      },
      success(result) {
        resolve(result)
      },
      error(err) {
        reject(err)
      },
    });
  });
}


export default ({ imagePreview, onImageChange, image, aspect, dir = 'avatar' }) => {
  const fileRef = useRef(null)
  const navigate = useNavigate()

  const [uploading, setUploading] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [cropping, setCropping] = useState(false)
  const [percentCrop, setPercentCrop] = useState(null)
  const [cropImageUri, setCropImageUri] = useState(null)

  useEffect(() => {
    if (image) {
      database.getImageCrop(image).then(response => {
        const cropData = response.data
        setPercentCrop(cropData)
      }).catch(
        error => {
          toast.error(get(error, 'message', 'Failed to get image crop data'), { autoClose: false })
        }
      )

      getImageUri(image, false).then(uri => {
        setCropImageUri(uri)
      })
    }
  }, [image])

  function selectImage (ev) {
    ev.preventDefault()
    fileRef.current.click()
  }

  /**
   * When a file is selected (a change on the file input) upload it
   * @param  {Object} ev File input change event
   * @return {void}
   */
  function fileSelected (ev) {
    ev.preventDefault()

    setUploading(true)

    const file = fileRef.current.files[0]
    const { type, size } = file
    const acceptedFileTypes = ['image/png', 'image/jpeg']

    if (!acceptedFileTypes.includes(type)) {
      toast.info('File must be a JPG or PNG')
      return
    }
    if (size > 25_000_000) {
      toast.info('Files must be under 25MB in size before compression')
      return
    }

    setPercentCrop(null)

    compressImage(file).then(async (result) => {
      return await database.createImage(result)
    }).then((response) => {
      getImageUri(response.data._id)
        .then(uri => {
          onImageChange(response.data)
          setCropImageUri(uri)
          setUploading(false)
        })
    }).catch((error) => {
      toast.error(get(error, 'message', 'Failed to store image'), { autoClose: false })
    })
  }

  /**
   * Called when the selected crop area changes.
   * @param {Object} _ Crop in pixels, not used since it corresponds to the dimensions of the element,
   *                   not the underlying image
   * @param {Object} percentCrop New crop selection in percent
   */
  function onCropChange (_, percentCrop) {
    setPercentCrop(percentCrop)
  }

  /**
   * Calculate the crop pixels and crop the image
   * @param  {Object} e Click event from the crop image button
   * @return {void}
   */
  function cropImage (e) {
    e.preventDefault()

    setCropping(true)

    Image.load(cropImageUri.url)
      .then(image => {
        if ((percentCrop === null) || (percentCrop.width === 0) || (percentCrop.height === 0) ||
            (percentCrop.x === 0 && percentCrop.y === 0 && percentCrop.width === 1 && percentCrop.height === 1)) {
          return image
        }

        const cropX = Math.min(Math.round(percentCrop.x * image.width / 100), image.width)
        const cropY = Math.min(Math.round(percentCrop.y * image.height / 100), image.height)
        const cropWidth = Math.min(Math.round(percentCrop.width * image.width / 100), image.width - cropX)
        const cropHeight = Math.min(Math.round(percentCrop.height * image.height / 100), image.height - cropY)

        if (cropWidth < 1 || cropHeight < 1) {
          return image
        }

        return image.crop({
          x: cropX,
          y: cropY,
          width: cropWidth,
          height: cropHeight,
        })
      })
      .then(async cropped => {
        return await cropped.toBlob(cropped.alpha ? 'image.png' : 'image/jpeg', 0.8)
      })
      .then(async blob => {
        console.log(percentCrop)
        return await database.updateCroppedImage(image, blob, percentCrop)
      })
      .then(response => {
        setCropping(false)

        invalidateCropped(image)
        onImageChange(response.data)
        setShowCropper(false)
        toast.success('Image cropped')
      })
      .catch(error => {
        toast.error(get(error, 'message', 'Failed to crop image'), { autoClose: false })
      })
  }

  /**
   * Hide the crop image UI
   * @return {void}
   */
  function cancelCrop () {
    setShowCropper(false)
  }

  if (uploading) { return (<Loading message='Uploading image...' />) }

  if (cropping) { return (<Loading message='Cropping image...' />) }

  if (showCropper) {
    return (
      <div>
        <ReactCrop
          crop={percentCrop}
          onChange={onCropChange}
          aspect={aspect}
        >
          <img src={cropImageUri.url} />
        </ReactCrop>
        <div style={{ textAlign: 'center' }}>
          <button className='btn btn-default' onClick={cancelCrop}>Cancel Crop</button>
          <button className='btn btn-primary' onClick={cropImage}>Crop Image</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {imagePreview}
      <button className='btn btn-link' style={{ margin: 10 }} onClick={selectImage}>Upload Image</button>
      <button className='btn btn-link' style={{ margin: 10 }} disabled={!image} onClick={() => setShowCropper(true)}>Crop Image</button>
      <input name='file' type='file' id='file' accept='.png,.jpg,.jpeg,image/png,image/jpeg' onChange={fileSelected} ref={fileRef} style={{ display: 'none' }} />
    </div>
  )
}
