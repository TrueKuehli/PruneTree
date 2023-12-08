import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import get from 'lodash.get'
import { useParams } from 'react-router-dom'
import styles from './styles.scss'
import Toolbar from './Toolbar'
import NodeEdit from '../NodeEditor'
import Tree from '../Tree'
import database from '../../../database/api'

export default () => {
  const params = useParams()
  const { treeId } = params
  const [loading, setLoading] = useState(true)
  const [tree, setTree] = useState(null)
  const [people, setPeople] = useState([])
  const [readonly, setReadonly] = useState(false)
  const [nodeToEdit, setNodeToEdit] = useState(null)

  useEffect(() => {
    setLoading(true)

    const getTree = database.getTree(treeId);
    const getPeople = database.getPeople(treeId);

    Promise.all([getTree, getPeople])
      .then((response) => {
        const tree = get(response, '[0].data')
        const people = get(response, '[1].data')

        setLoading(false)
        setTree(tree)
        setPeople(people)
      })
      .catch((error) => {
        setLoading(false)
        toast.error(get(error, 'message', 'Unknown error occurred'), { autoClose: false })
      })
  }, [treeId])

  function saveTree (tree, alertSuccess = false) {
    // only save the tree structure data
    const { data } = tree

    database.updateTree(treeId, data)
      .then(() => {
        setTree(tree)
        if (alertSuccess) {
          toast.success('Tree saved')
        }
      })
      .catch((error) => {
        toast.error(get(error, 'message', 'Unknown error occurred'), { autoClose: false })
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
