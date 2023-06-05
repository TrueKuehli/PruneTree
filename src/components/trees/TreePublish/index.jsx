import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import get from 'lodash.get'
import { Link, useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'
import styles from './styles.scss'
import auth from '../../../common/js/auth'
import Loading from '../../Loading'

export default () => {
  const navigate = useNavigate()
  const params = useParams()
  const { treeId } = params
  const [loading, setLoading] = useState(true)
  const [publishDate, setPublishDate] = useState(null)
  const [published, setPublished] = useState(false)
  const [publishedToGallery, setPublishedToGallery] = useState(false)

  useEffect(() => {
    axios.get(`/api/published/${treeId}`)
      .then((response) => {
        setPublished(true)
        setPublishDate(response.data.lastPublishDate)
        setPublishedToGallery(response.data.publishToGallery)
        setLoading(false)
      })
      .catch((error) => {
        if (get(error, 'response.status') === 404) {
          setPublished(false)
          setPublishDate(null)
          setPublishedToGallery(false)
          setLoading(false)
          return
        }
        toast.error('Failed to get tree info', { autoClose: false })
      })
  }, [])

  function handleTogglePublished () {
    setPublishedToGallery(published ? false : publishedToGallery)
    setPublished(!published)
  }

  function handleTogglePublishedToGallery () {
    if (!published) {
      return
    }
    setPublishedToGallery(!publishedToGallery)
  }

  function handleSubmit (event) {
    event.preventDefault()
    if (published) {
      _publishTree(publishedToGallery)
    } else {
      _unpublishTree()
    }
  }

  function _publishTree (publishToGallery) {
    const authToken = auth.getToken()

    axios.put(`/api/published/${treeId}`,
      { publishToGallery },
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
      .then(() => {
        toast.success('Tree published')
        navigate(`/trees/${treeId}`)
      })
      .catch((error) => {
        if (auth.loginRequired(error, navigate)) {
          return
        }
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred publishing your tree'), { autoClose: false })
      })
  }

  function _unpublishTree () {
    const authToken = auth.getToken()

    axios.delete(`/api/published/${treeId}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
      .then(() => {
        toast.success('Tree is no longer published')
        navigate(`/trees/${treeId}`)
      })
      .catch((error) => {
        if (get(error, 'response.status') === 404) {
          toast.success('Tree is already not published')
          return navigate(`/trees/${treeId}`)
        }
        if (auth.loginRequired(error, navigate)) {
          return
        }
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred unpublishing your tree'), { autoClose: false })
      })
  }

  if (loading) {
    return (<Loading message='Loading tree details...' />)
  }

  const publicUrl = `https://www.theplumtreeapp.com/public/${treeId}`
  const publicLink = <a href={publicUrl}>{publicUrl}</a>
  const message = publishDate ? `Your tree was last published on ${moment(publishDate).format('MMMM Do YYYY')}. It is publicly accessible at ` : 'Once published your tree will be publicly accessible to view at '
  const cancelClass = [styles.formBtn, 'btn', 'btn-default'].join(' ')
  const submitClass = [styles.formBtn, 'btn', 'btn-primary'].join(' ')

  return (
    <form onSubmit={handleSubmit} className='container'>
      <h1>Publish Your Tree</h1>
      <p>Share your tree with the world by publishing it. Have even more people see it by making it visible on the Gallery.</p>
      <div className='side-note'><p>{message}{publicLink}</p></div>
      <input type='checkbox' checked={published} onChange={handleTogglePublished} />
      <label className='checkbox' onClick={handleTogglePublished}>
        <span /> Is Public
      </label>
      <input type='checkbox' checked={publishedToGallery} disabled={!published} onChange={handleTogglePublishedToGallery} />
      <label className='checkbox' onClick={handleTogglePublishedToGallery}>
        <span /> Display in Gallery
      </label>
      <Link className={cancelClass} to={`/trees/${treeId}`}>Cancel</Link>
      <button type='submit' className={submitClass}>Save Settings</button>
    </form>
  )
}
