import React, { Component } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import get from 'lodash.get'
import { Link } from 'react-router-dom'

import styles from './styles.scss'
import auth from '../../../common/js/auth'
import defaultAvatar from '../../../common/images/default-avatar.png'
import Loading from '../../Loading'
import { getUploadedImageUri } from '../../../common/js/utils'

class TreePeople extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      people: [],
      filter: '',
      filteredPeople: []
    }

    this.handleFilterPeople = this.handleFilterPeople.bind(this)
    this._filterPeople = this._filterPeople.bind(this)
    this.deletePerson = this.deletePerson.bind(this)
    this._removePersonFromTree = this._removePersonFromTree.bind(this)
  }

  componentDidMount () {
    this.setState({
      loading: true
    })

    const treeId = this.props.match.params.treeId
    const authToken = auth.getToken()
    const headers = { headers: { Authorization: `Bearer ${authToken}` } }

    axios.all([
      axios.get(`/api/people?tree=${treeId}`, headers),
      axios.get(`/api/trees/${treeId}`, headers)
    ])
      .then(axios.spread((peopleResponse, treeResponse) => {
        const people = get(peopleResponse, 'data')
        const tree = get(treeResponse, 'data')

        this.setState({
          loading: false,
          people,
          tree,
          filter: '',
          filteredPeople: people
        })
      }))
      .catch((error) => {
        this.setState({
          loading: false
        })
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred'), { autoClose: false })
      })
  }

  handleFilterPeople (event) {
    this.setState({
      filter: event.target.value,
      filteredPeople: this._filterPeople(this.state.people, event.target.value)
    })
  }

  _filterPeople (people, filter = '') {
    if (filter === '') {
      return people
    }

    return people.filter(person => {
      const name = `${person.firstName} ${person.lastName}`.toLowerCase()
      return name.includes(filter.toLowerCase())
    })
  }

  deletePerson (personId) {
    const treeId = this.props.match.params.treeId
    const authToken = auth.getToken()
    const headers = { headers: { Authorization: `Bearer ${authToken}` } }

    if (!authToken) {
      return toast.error('Looks like you\'re not logged in', { autoClose: false })
    }

    const deleteConfirmed = confirm('Are you sure you want to delete this person?')

    if (deleteConfirmed) {
      // delete all references of this person in the tree
      const tree = Object.assign({}, this.state.tree)
      this._removePersonFromTree(personId, tree.data)

      axios.all([
        axios.patch(`/api/trees/${treeId}`, { data: tree.data }, headers),
        axios.delete(`/api/people/${personId}`, headers)
      ])
        .then(axios.spread((saveTreeResponse, deletePersonResponse) => {
          this.setState({
            people: this.state.people.filter((person) => person._id !== personId),
            filteredPeople: this.state.filteredPeople.filter((person) => person._id !== personId)
          })
          toast.success('Person removed')
        }))
        .catch((error) => {
          console.error(error)
          toast.error(get(error, 'response.data.errors[0].detail', 'Failed to delete person from tree'), { autoClose: false })
        })
    }
  }

  _removePersonFromTree (personId, treeNode) {
    if (get(treeNode, 'person._id') === personId) {
      treeNode.person = null
    }

    if (get(treeNode, 'adoptiveParents.length', false)) {
      treeNode.adoptiveParents = treeNode.adoptiveParents.filter(parent => parent._id !== personId)
    }
    if (get(treeNode, 'parents.length', false)) {
      treeNode.parents = treeNode.parents.filter(parent => parent._id !== personId)
    }
    if (get(treeNode, 'partners.length', false)) {
      treeNode.partners.forEach(partnerRow => {
        if (get(partnerRow, 'people.length', false)) {
          partnerRow.people = partnerRow.people.filter(partner => partner._id !== personId)
        }
      })
    }
    if (get(treeNode, 'children.length', false)) {
      treeNode.children.forEach(child => this._removePersonFromTree(personId, child))
    }
  }

  render () {
    if (this.state.loading) {
      return (
        <Loading message='Loading people' />
      )
    }

    const people = this.state.filteredPeople
    const treeId = this.props.match.params.treeId
    const personCreateLink = `/trees/${treeId}/people/add`

    return (
      <div className='container'>
        <h1>Manage People in Your Tree</h1>
        <p>Here you can create people to place in the structure of your family tree or edit existing people already in the tree.</p>
        <div className={styles.navButtons}>
          <Link id='back-to-tree' className='btn btn-default' to={`/trees/${treeId}`}><i className='icon-chevron-left' /> Back to Your Tree</Link>
          <Link id='add-new-person' className='btn btn-primary' to={personCreateLink}><i className='icon-plus' /> Add Someone New</Link>
        </div>
        <div className='form-group'>
          <label>Search</label>
          <input
            className='form-control'
            type='text'
            name='filter'
            value={this.state.filter}
            placeholder='Start typing to filter...'
            onChange={this.handleFilterPeople}
          />
        </div>
        {people.map((person) => {
          const personEditLink = `/trees/${treeId}/people/${person._id}`
          const personLinkLink = `/trees/${treeId}/people/${person._id}/link`

          let backgroundImage
          if (person.avatar) {
            backgroundImage = `url(${getUploadedImageUri(person.avatar)})`
          } else {
            backgroundImage = `url(${defaultAvatar})`
          }

          const inlineAvatarStyle = { backgroundImage }
          let name
          if (person.firstName || person.lastName) {
            name = `${person.firstName} ${person.lastName}`
          } else {
            name = (<i>~ No Name ~</i>)
          }

          return (
            <div key={person._id} className={`${styles.personTile} people-list-item`}>
              <div className={styles.avatar} style={inlineAvatarStyle} />
              <div>{name}</div>
              <div className={styles.personMenu}>
                <Link className='btn btn-small btn-default edit-person' to={personEditLink}>Edit</Link>
                <Link className='btn btn-small btn-default link-person' to={personLinkLink}>Link</Link>
                <button className='btn btn-small btn-danger delete-person' onClick={() => this.deletePerson(person._id)}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
};

export default TreePeople
