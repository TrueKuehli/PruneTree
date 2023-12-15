import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import get from 'lodash.get'
import { Link, useParams, useNavigate } from 'react-router-dom'
import styles from './styles.scss'
import Loading from '../../Loading'
import database from "../../../database/api";
import TreePerson from "./TreePerson";


export default ({ loading: loadingProp }) => {
  const params = useParams()
  const { treeId } = params
  const [loading, setLoading] = useState(loadingProp)
  const [people, setPeople] = useState([])
  const [tree, setTree] = useState(null)
  const [filter, setFilter] = useState('')
  const [filteredPeople, setFilteredPeople] = useState([])

  useEffect(() => {
    setLoading(true)

    const getTree = database.getTree(treeId);
    const getPeople = database.getPeople(treeId);

    Promise.all([getTree, getPeople])
      .then((response) => {
        const tree = get(response, '[0].data')
        const people = get(response, '[1].data')

        setPeople(people)
        setTree(tree)
        setFilter('')
        setFilteredPeople(people)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        toast.error(get(error, 'message', 'Unknown error occurred'), { autoClose: false })
      })
  }, [treeId])

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
    const deleteConfirmed = confirm('Are you sure you want to delete this person?')

    if (deleteConfirmed) {
      // delete all references of this person in the tree
      const updatedTree = Object.assign({}, tree)
      _removePersonFromTree(personId, updatedTree.data)

      const updateTree = database.updateTree(treeId, { data: updatedTree.data });
      const deletePerson = database.deletePerson(personId);
      Promise.all([updateTree, deletePerson])
        .then(() => {
          setPeople(people.filter((person) => person._id !== personId))
          setFilteredPeople(filteredPeople.filter((person) => person._id !== personId))
          toast.success('Person removed')
        })
        .catch((error) => {
          toast.error(get(error, 'message', 'Unknown error occurred'), { autoClose: false })
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
      {filteredPeople.map((person) =>
        <TreePerson key={person._id} treeId={treeId} person={person} deletePerson={deletePerson}/>
      )}
    </div>
  )
}
