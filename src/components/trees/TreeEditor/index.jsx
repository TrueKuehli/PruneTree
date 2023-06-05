import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import get from 'lodash.get'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './styles.scss'
import Toolbar from './Toolbar'
import NodeEdit from '../NodeEditor'
import Tree from '../Tree'
import auth from '../../../common/js/auth'

export default () => {
  const params = useParams()
  const navigate = useNavigate()
  const { treeId } = params
  const [loading, setLoading] = useState(true)
  const [tree, setTree] = useState(null)
  const [people, setPeople] = useState([])
  const [readonly, setReadonly] = useState(false)
  const [nodeToEdit, setNodeToEdit] = useState(null)

  useEffect(() => {
    setLoading(true)

    const authToken = auth.getToken()

    if (!authToken) {
      return toast.error('Looks like you\'re not logged in', { autoClose: false })
    }

    const getTree = axios.get(`/api/trees/${treeId}`,
      { headers: { Authorization: `Bearer ${authToken}` } })
    const getPeople = axios.get(`/api/people?tree=${treeId}`,
      { headers: { Authorization: `Bearer ${authToken}` } })

    Promise.all([getTree, getPeople])
      .then((response) => {
        const tree = get(response, '[0].data')
        const people = get(response, '[1].data')

        setLoading(false)
        setTree(tree)
        setPeople(people)
      })
      .catch((error) => {
        if (auth.loginRequired(error, navigate)) {
          return
        }
        setLoading(false)
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred'), { autoClose: false })
      })
  }, [treeId])

  function saveTree (tree, alertSuccess = false) {
    const authToken = auth.getToken()

    if (!authToken) {
      return toast.error('Looks like you\'re not logged in', { autoClose: false })
    }

    // only save the tree structure data
    const { data } = tree

    axios.patch(`/api/trees/${treeId}`,
      { data },
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
      .then(() => {
        setTree(tree)
        if (alertSuccess) {
          toast.success('Tree saved')
        }
      })
      .catch((error) => {
        if (auth.loginRequired(error, navigate)) {
          return
        }
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred'), { autoClose: false })
      })
  }

  return (
    <div className={styles.root}>
      <h1 className='sr-only'>Tree Editor</h1>
      <Tree
        tree={tree}
        people={people}
        loading={loading}
        readonly={readonly}
        onChange={saveTree}
        onEditNode={setNodeToEdit}
      />
      <Toolbar
        tree={tree}
        saveTree={saveTree}
        setPreviewMode={setReadonly}
      />
      {nodeToEdit &&
        <NodeEdit
          people={people}
          tree={tree}
          node={nodeToEdit}
          close={() => setNodeToEdit(null)}
          onChange={saveTree}
        />}
    </div>
  )
}
