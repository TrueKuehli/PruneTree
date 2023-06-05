import React, { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import get from 'lodash.get'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import auth from '../../../common/js/auth'
import Loading from '../../Loading'
import { getOrigUploadedImageUri, getUploadedImageUri } from '../../../common/js/utils'

export default ({ imagePreview, onImageChange, image, aspect, dir = 'avatar' }) => {
  const fileRef = useRef(null)
  const navigate = useNavigate()

  const [uploading, setUploading] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [cropping, setCropping] = useState(false)
  const [naturalHeight, setNaturalHeight] = useState(null)
  const [naturalWidth, setNaturalWidth] = useState(null)
  const [crop, setCrop] = useState(null)
  const [percentCrop, setPercentCrop] = useState(null)
  const [cropImageUri, setCropImageUri] = useState(getUploadedImageUri(image))

  function selectImage (ev) {
    ev.preventDefault()
    fileRef.current.click()
  }

  /**
   * When a file is selected (a change on the file input) upload it
   * @param  {Object} event File input change event
   * @return {void}
   */
  function fileSelected (ev) {
    ev.preventDefault()

    const authToken = auth.getToken()
    if (!authToken) {
      return toast.error('Looks like you\'re not logged in', { autoClose: false })
    }

    setUploading(true)

    const file = fileRef.current.files[0]
    const { type, size } = file
    const acceptedFileTypes = ['image/png', 'image/jpeg']

    if (!acceptedFileTypes.includes(type)) {
      return toast.info('File must be a JPG or PNG')
    }
    if (size > 10000000) {
      return toast.info('Files must be under 10MB in size')
    }

    let uploadedFile

    // get S3 signed URL
    axios.get(`/api/upload/url?type=${type}&dir=${dir}`,
      { headers: { Authorization: `Bearer ${authToken}` } })
      .then(response => {
        uploadedFile = response.data.filename

        const options = {
          headers: {
            'Content-Type': type,
            'x-amz-acl': 'public-read'
          }
        }

        options.headers['x-amz-tagging'] = 'temp=true'

        // upload to S3
        return axios.put(
          response.data.uploadURL,
          file,
          options)
      })
      .then(() => {
        onImageChange(uploadedFile)
        setCropImageUri(getOrigUploadedImageUri(uploadedFile))
        setUploading(false)
      })
      .catch(error => {
        if (auth.loginRequired(error, navigate)) {
          return
        }
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred uploading your file'), { autoClose: false })
      })
  }

  /**
   * Called when the selected crop area changes.
   * @param  {Object} crop New crop selection
   * @return {void}
   */
  function onCropChange (crop, percentCrop) {
    setCrop(crop)
    setPercentCrop(percentCrop)
  }

  /**
   * When an image loads in the cropper get its original dimension. This is
   * because ReactCrop uses percentages for its crop dimensions but our crop
   * endpoint uses pixels so some math is needed.
   * @param  {Object} image ReactCrop image object
   * @return {void}
   */
  function onImageLoaded (image) {
    setNaturalWidth(image.currentTarget.naturalWidth)
    setNaturalHeight(image.currentTarget.naturalHeight)
  }

  /**
   * Calculate the crop pixels and send details of dimensions and image to crop
   * to our crop endpoint.
   * @param  {Object} e Click event from the crop image button
   * @return {void}
   */
  function cropImage (e) {
    e.preventDefault()

    const authToken = auth.getToken()
    if (!authToken) {
      return toast.error('Looks like you\'re not logged in', { autoClose: false })
    }

    setCropping(true)

    // convert crop data from percentages to pixels
    const cropData = {
      x: Math.floor((percentCrop.x / 100) * naturalWidth),
      y: Math.floor((percentCrop.y / 100) * naturalHeight),
      width: Math.floor((percentCrop.width / 100) * naturalWidth),
      height: Math.floor((percentCrop.height / 100) * naturalHeight)
    }

    axios.put('/api/upload/crop',
      { cropData, image },
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
      .then((response) => {
        const croppedFile = get(response, 'data.filename')
        setCropping(false)
        setCrop(null)
        onImageChange(croppedFile)
        setCropImageUri(getOrigUploadedImageUri(croppedFile))
        setShowCropper(false)
        toast.success('Image cropped')
      })
      .catch((error) => {
        if (auth.loginRequired(error, navigate)) {
          return
        }
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred while cropping image'), { autoClose: false })
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
          crop={crop}
          onChange={onCropChange}
          aspect={aspect}
        >
          <img src={cropImageUri} onLoad={onImageLoaded} />
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
