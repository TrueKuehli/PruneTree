import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import get from 'lodash.get'
import styles from './styles.scss'
import Loading from '../../Loading'
import database from '../../../database/api'

export default () => {
  const params = useParams()
  const navigate = useNavigate()
  const { treeId, personId } = params
  const [title, setTitle] = useState('')
  const [person, setPerson] = useState('')
  const [tree, setTree] = useState('')
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    database.getPerson(personId)
      .then((response) => {
        const links = get(response, 'data.links', [])
        setLoading(false)
        setLinks(links)
      })
      .catch((error) => {
        setLoading(false)
        toast.error(get(error, 'message', 'Unknown error occurred'), { autoClose: false })
      })
  }, [personId])

  function handleSubmit (event) {
    event.preventDefault()

    links.push({
      title,
      treeId: tree,
      personId: person
    })

    database.updatePerson(personId, { links })
      .then((response) => {
        toast.success('Person links updated')
        setLinks(response.data.links)
      })
      .catch((error) => {
        toast.error(get(error, 'message', 'Unknown error occurred updating persons links'), { autoClose: false })
      })
  }

  function deleteLink (linkData) {
    const newLinks = links.filter((link) => {
      return link !== linkData
    })

    database.updatePerson(personId, { links: newLinks })
      .then((response) => {
        toast.success('Person links updated')
        setLinks(response.data.links)
      })
      .catch((error) => {
        toast.error(get(error, 'message', 'Unknown error occurred updating persons links'), { autoClose: false })
      })
  }

  if (loading) {
    return (
      <Loading messsage='Loading Person Links' />
    )
  }

  const cancelClass = [styles.formBtn, 'btn', 'btn-default'].join(' ')
  const submitClass = [styles.formBtn, 'btn', 'btn-primary'].join(' ')
  const cancelLink = `/trees/${treeId}/people`

  return (
    <div className='container'>
      <h1>Link Person</h1>
      <p>If this person is also in another tree elsewhere you can link the two trees via this person.</p>
      <p>You'll need the tree ID and the ID of the person you want to link to from that tree.</p>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input id='link-tree-title' className='form-control' type='text' name='title' placeholder='My Other Tree' value={title} onChange={ev => setTitle(ev.target.value)} />
        </div>
        <div className='form-group'>
          <label>Tree ID</label>
          <input id='link-tree-id' className='form-control' type='text' name='tree' value={tree} onChange={ev => setTree(ev.target.value)} />
        </div>
        <div className='form-group'>
          <label>Person ID</label>
          <input id='link-tree-person' className='form-control' type='text' name='person' value={person} onChange={ev => setPerson(ev.target.value)} />
        </div>
        <Link className={cancelClass} to={cancelLink}><i className='icon-chevron-left' /> Back to Tree People</Link>
        <button id='submit-tree-link' type='submit' className={submitClass}><i className='icon-plus' />  Link Person</button>
      </form>
      <h2>Existing Links</h2>

      {links.length
        ? (
          <p>Here's the links to other trees this person already has. Remember a Sim can be linked to multiple trees.</p>
          )
        : (
          <p>Links you add/create will appear here.</p>
          )}

      {links.map((linkData, index) => {
        return (
          <div key={index} className={styles.linkTile}>
            <div className={styles.linkMenu}>
              <button className='btn btn-small btn-danger' onClick={() => deleteLink(linkData)}>Delete</button>
            </div>
            <div className={styles.linkDetails}>
              <a id={`link-info-title-${index}`} href='/'>
                {linkData.title} <i className='icon-link' />
              </a>
              <div id={`link-info-tree-${index}`}><strong>Tree Id:</strong> {linkData.treeId}</div>
              <div id={`link-info-person-${index}`}><strong>Person Id:</strong> {linkData.personId}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
