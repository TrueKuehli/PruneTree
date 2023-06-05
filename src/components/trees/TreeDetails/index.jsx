import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import get from 'lodash.get'
import { getOrigUploadedImageUri, getUploadedImageUri } from '../../../common/js/utils'
import RichEditor from '../../RichEditor'
import auth from '../../../common/js/auth'
import styles from './styles.scss'
import Loading from '../../Loading'
import ImageManager from '../ImageManager'

export default ({ addTree, updateTree }) => {
  const navigate = useNavigate()
  const params = useParams()
  const { treeId } = params
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [cover, setCover] = useState(null)
  const [coverUri, setCoverUri] = useState(null)
  const [loading, setLoading] = useState(!!treeId)

  useEffect(() => {
    const authToken = auth.getToken()

    if (!authToken) {
      setLoading(false)
      return toast.error('Looks like you\'re not logged in', { autoClose: false })
    }

    if (treeId) {
      axios.get(`/api/trees/${treeId}`, { headers: { Authorization: `Bearer ${authToken}` } })
        .then((response) => {
          const { title, description, cover } = response.data
          setTitle(title)
          setDescription(description)
          setCover(cover)
          setCoverUri(getUploadedImageUri(cover, '600x320'))
          setLoading(false)
        })
        .catch((error) => {
          if (auth.loginRequired(error, navigate)) {
            return
          }
          setLoading(false)
          toast.error(get(error, 'response.data.errors[0].detail', 'Failed to get tree info'), { autoClose: false })
        })
    }
  }, [])

  function updateCover (image) {
    setCoverUri(getOrigUploadedImageUri(image))
    setCover(image)
  }

  function handleSubmit (event) {
    event.preventDefault()

    const authToken = auth.getToken()

    if (!authToken) {
      return toast.error('Looks like you\'re not logged in', { autoClose: false })
    }

    const tree = { title, description, cover }

    if (treeId) {
      _updateTree(treeId, tree, authToken)
    } else {
      _createTree(tree, authToken)
    }
  }

  function _createTree (tree, authToken) {
    axios.post('/api/trees',
      tree,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
      .then((response) => {
        const tree = get(response, 'data')
        const treeId = get(response, 'data._id')
        toast.success('Tree created')
        navigate(`/trees/${treeId}`)
        // update the side nav
        addTree(tree)
      })
      .catch((error) => {
        if (auth.loginRequired(error, navigate)) {
          return
        }
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred creating tree'), { autoClose: false })
      })
  }

  function _updateTree (treeId, tree, authToken) {
    axios.patch(`/api/trees/${treeId}`,
      tree,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
      .then(() => {
        toast.success('Tree details updated')
        navigate(`/trees/${treeId}`)
        // update the side nav
        updateTree(Object.assign(tree, { _id: treeId }))
      })
      .catch((error) => {
        if (auth.loginRequired(error, navigate)) {
          return
        }
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred updating tree details'), { autoClose: false })
      })
  }

  if (loading) {
    return (<Loading message='Loading...' />)
  }

  const cancelLink = treeId ? `/trees/${treeId}` : '/'
  const cancelClass = [styles.formBtn, 'btn', 'btn-default'].join(' ')
  const submitClass = [styles.formBtn, 'btn', 'btn-primary'].join(' ')

  let imagePreview
  if (cover) {
    console.log(cover)
    const style = { backgroundImage: `url(${coverUri})` }
    imagePreview = (<div className={styles.coverImage} style={style} />)
  } else {
    imagePreview = (<div className={styles.coverImage}>No cover image currently set.</div>)
  }

  return (
    <div className='container'>
      <h1>{treeId ? 'Update Tree Details' : 'Create a New Tree'}</h1>

      <ImageManager
        image={cover}
        imagePreview={imagePreview}
        dir='cover'
        onImageChange={updateCover}
      />

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input id='tree-title-input' className='form-control' type='text' name='title' value={title} onChange={ev => setTitle(ev.target.value)} />
        </div>
        <RichEditor initialHtml={description} onUpdate={setDescription} />
        <Link className={cancelClass} to={cancelLink}>Cancel</Link>
        <button id='tree-details-submit' type='submit' className={submitClass}>{treeId ? 'Update Tree Details' : 'Create Tree'}</button>
      </form>
    </div>
  )
}
