import React, { Component } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import get from 'lodash.get'
import { Link, withRouter } from 'react-router-dom'
import moment from 'moment'

import styles from './styles.scss'
import auth from '../../../common/js/auth'
import Loading from '../../Loading'

class TreePublish extends Component {
  constructor (props) {
    super(props)

    this.handleTogglePublished = this.handleTogglePublished.bind(this)
    this.handleTogglePublishedToGallery = this.handleTogglePublishedToGallery.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      loading: true,
      publishDate: null,
      published: false,
      publishedToGallery: false
    }
  }

  componentDidMount () {
    const { treeId } = this.props.match.params

    axios.get(`/api/published/${treeId}`)
      .then((response) => {
        this.setState({
          loading: false,
          publishDate: response.data.lastPublishDate,
          published: true,
          publishedToGallery: response.data.publishToGallery
        })
      })
      .catch((error) => {
        if (get(error, 'response.status') === 404) {
          return this.setState({
            loading: false,
            publishDate: null,
            published: false,
            publishedToGallery: false
          })
        }
        toast.error('Failed to get tree info', { autoClose: false })
      })
  }

  handleTogglePublished () {
    this.setState({
      published: !this.state.published,
      publishedToGallery: this.state.published ? false : this.state.publishedToGallery
    })
  }

  handleTogglePublishedToGallery () {
    if (!this.state.published) {
      return
    }
    this.setState({
      publishedToGallery: !this.state.publishedToGallery
    })
  }

  handleSubmit (event) {
    event.preventDefault()

    // convert to boolean if undefined/null
    const publishedToGallery = !!this.state.publishedToGallery

    if (this.state.published) {
      this._publishTree(publishedToGallery)
    } else {
      this._unpublishTree()
    }
  }

  _publishTree (publishToGallery) {
    const { treeId } = this.props.match.params
    const { history } = this.props
    const authToken = auth.getToken()

    axios.put(`/api/published/${treeId}`,
      { publishToGallery },
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
      .then(() => {
        toast.success('Tree published')
        history.push(`/trees/${treeId}`)
      })
      .catch((error) => {
        console.error(error)
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred publishing your tree'), { autoClose: false })
      })
  }

  _unpublishTree () {
    const { treeId } = this.props.match.params
    const { history } = this.props
    const authToken = auth.getToken()

    axios.delete(`/api/published/${treeId}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
      .then(() => {
        toast.success('Tree is no longer published')
        this.props.history.push(`/trees/${treeId}`)
      })
      .catch((error) => {
        if (get(error, 'response.status') === 404) {
          toast.success('Tree is already not published')
          return history.push(`/trees/${treeId}`)
        }
        console.error(error)
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred unpublishing your tree'), { autoClose: false })
      })
  }

  render () {
    if (this.state.loading) {
      return (<Loading message='Loading tree details...' />)
    }

    const { treeId } = this.props.match.params
    const publicUrl = `https://www.theplumtreeapp.com/public/${treeId}`
    const publicLink = <a href={publicUrl}>{publicUrl}</a>
    const { publishDate } = this.state

    const message = publishDate ? `Your tree was last published on ${moment(publishDate).format('MMMM Do YYYY')}. It is publicly accessible at ` : 'Once published your tree will be publicly accessible to view at '

    const cancelClass = [styles.formBtn, 'btn', 'btn-default'].join(' ')
    const submitClass = [styles.formBtn, 'btn', 'btn-primary'].join(' ')

    return (
      <form onSubmit={this.handleSubmit} className='container'>
        <h1>Publish Your Tree</h1>
        <p>Share your tree with the world by publishing it. Have even more people see it by making it visible on the Gallery.</p>
        <div className='side-note'><p>{message}{publicLink}</p></div>
        <input type='checkbox' checked={this.state.published} onChange={this.handleTogglePublished} />
        <label className='checkbox' onClick={this.handleTogglePublished}>
          <span /> Is Public
        </label>
        <input type='checkbox' checked={this.state.publishedToGallery} disabled={!this.state.published} onChange={this.handleTogglePublishedToGallery} />
        <label className='checkbox' onClick={this.handleTogglePublishedToGallery}>
          <span /> Display in Gallery
        </label>
        <Link className={cancelClass} to={`/trees/${treeId}`}>Cancel</Link>
        <button type='submit' className={submitClass}>Save Settings</button>
      </form>
    )
  }
};

export default withRouter(TreePublish)
