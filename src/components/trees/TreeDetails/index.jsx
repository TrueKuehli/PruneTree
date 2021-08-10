import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import get from 'lodash.get'
import { getOrigUploadedImageUri } from '../../../common/js/utils'

import RichEditor from '../../RichEditor'
import auth from '../../../common/js/auth'
import styles from './styles.scss'
import Loading from '../../Loading'
import ImageManager from '../ImageManager'

class TreeDetails extends Component {
  constructor (props) {
    super(props)

    const { treeId } = props.match.params

    this.state = {
      _id: treeId,
      title: '',
      description: '',
      cover: null,
      loading: !!treeId
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleImageChange = this.handleImageChange.bind(this)

    // When the rich text editor changes, update the state with the new
    // description
    this.handleDescriptionUpdate = (description) => this.setState({ description })
  }

  componentDidMount () {
    const authToken = auth.getToken()
    const treeId = this.state._id

    if (!authToken) {
      this.setState({
        loading: false
      })
      return toast.error('Looks like you\'re not logged in', { autoClose: false })
    }

    if (treeId) {
      axios.get(`/api/trees/${treeId}`, { headers: { Authorization: `Bearer ${authToken}` } })
        .then((response) => {
          this.setState(response.data)
          this.setState({
            loading: false
          })
        })
        .catch((error) => {
          console.error(error)
          this.setState({
            loading: false
          })
          toast.error('Failed to get tree info', { autoClose: false })
        })
    }
  }

  handleImageChange (cover) {
    this.setState({ cover })
  }

  handleChange (event) {
    const newState = {}
    newState[event.target.name] = event.target.value
    this.setState(newState)
  }

  handleSubmit (event) {
    event.preventDefault()

    const authToken = auth.getToken()
    const treeId = this.state._id

    if (!authToken) {
      return toast.error('Looks like you\'re not logged in', { autoClose: false })
    }

    const tree = {
      title: this.state.title,
      description: this.state.description,
      cover: this.state.cover
    }

    if (treeId) {
      this._updateTree(treeId, tree, authToken)
    } else {
      this._createTree(tree, authToken)
    }
  }

  _createTree (tree, authToken) {
    axios.post('/api/trees',
      tree,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
      .then((response) => {
        const { history } = this.props
        const tree = get(response, 'data')
        const treeId = get(response, 'data._id')
        toast.success('Tree created')
        history.push(`/trees/${treeId}`)

        this.props.addTree(tree)
      })
      .catch((error) => {
        console.error(error)
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred creating tree'), { autoClose: false })
      })
  }

  _updateTree (treeId, tree, authToken) {
    axios.patch(`/api/trees/${treeId}`,
      tree,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
      .then(() => {
        toast.success('Tree details updated')
        this.props.history.push(`/trees/${treeId}`)

        this.props.updateTree(Object.assign(tree, { _id: treeId }))
      })
      .catch((error) => {
        console.error(error)
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred updating tree details'), { autoClose: false })
      })
  }

  render () {
    if (this.state.loading) {
      return (
        <Loading message='Loading...' />
      )
    }

    const treeId = this.state._id
    let cancelLink

    if (treeId) {
      cancelLink = `/trees/${treeId}`
    } else {
      cancelLink = '/'
    }

    const cancelClass = [styles.formBtn, 'btn', 'btn-default'].join(' ')
    const submitClass = [styles.formBtn, 'btn', 'btn-primary'].join(' ')

    let imagePreview

    if (this.state.cover) {
      const style = { backgroundImage: `url(${getOrigUploadedImageUri(this.state.cover)})` }

      imagePreview = (<div className={styles.coverImage} style={style} />)
    } else {
      imagePreview = (<div className='side-note'>No cover image currently set.</div>)
    }

    return (
      <div className='container'>
        <h1>{treeId ? 'Update Tree Details' : 'Create a New Tree'}</h1>

        <ImageManager
          image={this.state.cover}
          imagePreview={imagePreview}
          dir='cover'
          onImageChange={this.handleImageChange}
        />

        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label>Title</label>
            <input id='tree-title-input' className='form-control' type='text' name='title' value={this.state.title} onChange={this.handleChange} />
          </div>
          <RichEditor initialHtml={this.state.description} onUpdate={this.handleDescriptionUpdate} />
          <Link className={cancelClass} to={cancelLink}>Cancel</Link>
          <button id='tree-details-submit' type='submit' className={submitClass}>{treeId ? 'Update Tree Details' : 'Create Tree'}</button>
        </form>
      </div>
    )
  }
};

export default withRouter(TreeDetails)
