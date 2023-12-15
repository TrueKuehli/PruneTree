import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import get from 'lodash.get'
import { getImageUri } from '../../../common/js/utils'
import RichEditor from '../../RichEditor'
import styles from './styles.scss'
import Loading from '../../Loading'
import ImageManager from '../ImageManager'
import database from '../../../common/scripts/database'

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
    if (treeId) {
      database.getTree(treeId)
        .then((response) => {
          const { title, description, cover } = response.data
          setTitle(title)
          setDescription(description)
          if (cover) {
            getImageUri(cover).then(uri => {
              setCoverUri(uri)
              setCover(cover)
              setLoading(false)
            })
          } else {
            setCover(null)
            setLoading(false)
          }
        })
        .catch((error) => {
          setLoading(false)
          toast.error(get(error, 'message', 'Failed to get tree info'), { autoClose: false })
        })
    }
  }, [treeId])

  function updateCover(image) {
    const id = get(image, '_id')
    getImageUri(id).then(uri => {
      setCoverUri(uri)
      setCover(id)
    })
  }

  function handleSubmit (event) {
    event.preventDefault()

    const tree = { title, description, cover }

    if (treeId) {
      _updateTree(treeId, tree)
    } else {
      _createTree(tree)
    }
  }

  function _createTree (tree) {
    database.createTree(tree)
      .then((response) => {
        const tree = get(response, 'data')
        const treeId = get(response, 'data._id')
        toast.success('Tree created')
        navigate(`/trees/${treeId}`)
        // update the side nav
        addTree(tree)
      })
      .catch((error) => {
        toast.error(get(error, 'message', 'Unknown error occurred creating tree'), { autoClose: false })
      })
  }

  function _updateTree (treeId, tree) {
    database.updateTree(treeId, tree)
      .then(() => {
        toast.success('Tree details updated')
        // navigate(`/trees/${treeId}`)
        // update the side nav
        updateTree(Object.assign(tree, { _id: treeId }))
      })
      .catch((error) => {
        toast.error(get(error, 'message', 'Unknown error occurred updating tree details'), { autoClose: false })
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
    const style = { backgroundImage: `url(${coverUri.url})` }
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
        aspect={15 / 8}
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
