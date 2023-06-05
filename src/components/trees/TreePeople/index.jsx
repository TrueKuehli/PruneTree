import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import get from 'lodash.get'
import { Link, useParams, useNavigate } from 'react-router-dom'
import styles from './styles.scss'
import auth from '../../../common/js/auth'
import defaultAvatar from '../../../common/images/default-avatar.png'
import Loading from '../../Loading'
import { getUploadedImageUri } from '../../../common/js/utils'

export default ({ loading: loadingProp }) => {
  const params = useParams()
  const navigate = useNavigate()
  const { treeId } = params
  const [loading, setLoading] = useState(loadingProp)
  const [people, setPeople] = useState([])
  const [tree, setTree] = useState(null)
  const [filter, setFilter] = useState('')
  const [filteredPeople, setFilteredPeople] = useState([])

  useEffect(() => {
    setLoading(true)

    const authToken = auth.getToken()
    const headers = { headers: { Authorization: `Bearer ${authToken}` } }

    axios.all([
      axios.get(`/api/people?tree=${treeId}`, headers),
      axios.get(`/api/trees/${treeId}`, headers)
    ])
      .then(axios.spread((peopleResponse, treeResponse) => {
        const people = get(peopleResponse, 'data')
        const tree = get(treeResponse, 'data')

        setPeople(people)
        setTree(tree)
        setFilter('')
        setFilteredPeople(people)
        setLoading(false)
      }))
      .catch((error) => {
        if (auth.loginRequired(error, navigate)) {
          return
        }
        setLoading(false)
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred'), { autoClose: false })
      })
  }, [])

  function handleFilterPeople (event) {
    setFilter(event.target.value)
    setFilteredPeople(_filterPeople(people, event.target.value))
  }

  function _filterPeople (people, filter = '') {
    if (filter === '') {
      return people
    }

    return people.filter(person => {
      const name = `${person.firstName} ${person.lastName}`.toLowerCase()
      return name.includes(filter.toLowerCase())
    })
  }

  function deletePerson (personId) {
    const authToken = auth.getToken()
    const headers = { headers: { Authorization: `Bearer ${authToken}` } }

    if (!authToken) {
      return toast.error('Looks like you\'re not logged in', { autoClose: false })
    }

    const deleteConfirmed = confirm('Are you sure you want to delete this person?')

    if (deleteConfirmed) {
      // delete all references of this person in the tree
      const updatedTree = Object.assign({}, tree)
      _removePersonFromTree(personId, updatedTree.data)

      axios.all([
        axios.patch(`/api/trees/${treeId}`, { data: updatedTree.data }, headers),
        axios.delete(`/api/people/${personId}`, headers)
      ])
        .then(axios.spread((saveTreeResponse, deletePersonResponse) => {
          setPeople(people.filter((person) => person._id !== personId))
          setFilteredPeople(filteredPeople.filter((person) => person._id !== personId))
          toast.success('Person removed')
        }))
        .catch((error) => {
          if (auth.loginRequired(error, navigate)) {
            return
          }
          toast.error(get(error, 'response.data.errors[0].detail', 'Failed to delete person from tree'), { autoClose: false })
        })
    }
  }

  function _removePersonFromTree (personId, treeNode) {
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
      treeNode.children.forEach(child => _removePersonFromTree(personId, child))
    }
  }

  if (loading) {
    return (
      <Loading message='Loading people' />
    )
  }

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
          value={filter}
          placeholder='Start typing to filter...'
          onChange={handleFilterPeople}
        />
      </div>
      {filteredPeople.map((person) => {
        const personEditLink = `/trees/${treeId}/people/${person._id}`
        const personLinkLink = `/trees/${treeId}/people/${person._id}/link`

        let backgroundImage
        if (person.avatar) {
          backgroundImage = `url(${getUploadedImageUri(person.avatar, '200x200')})`
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
              <button className='btn btn-small btn-danger delete-person' onClick={() => deletePerson(person._id)}>Delete</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
