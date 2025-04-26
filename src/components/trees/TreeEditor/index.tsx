import React, {useState, useEffect} from 'react';
import {toast} from 'react-toastify';
import {useParams} from 'react-router-dom';
import {HierarchyPointNode} from 'd3';

import {Tree as TreeType, Person, TreePersonNode} from '../../../common/scripts/types';
import database from '../../../common/scripts/database';
import Tree from '../Tree';
import NodeEdit from '../NodeEditor';
import Toolbar from './Toolbar';

import * as styles from './styles.scss';


/**
 * The tree editor component.
 */
export default function TreeEditor() {
  const params = useParams();
  const {treeId} = params;
  const [loading, setLoading] = useState(true);
  const [tree, setTree] = useState<TreeType>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [readonly, setReadonly] = useState(false);
  const [nodeToEdit, setNodeToEdit] =
    useState<HierarchyPointNode<TreePersonNode>>(null);

  useEffect(() => {
    setLoading(true);

    const getTree = database.getTree(treeId);
    const getPeople = database.getPeople(treeId);

    Promise.all([getTree, getPeople])
      .then((response) => {
        const tree = response[0];
        const people = response[1];

        setLoading(false);
        setTree(tree);
        setPeople(people);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.message || 'Unknown error occurred', {autoClose: false});
      });
  }, [treeId]);

  /**
   * Save the tree to the database.
   * @param tree The tree to save.
   * @param alertSuccess If true, show a success toast.
   */
  function saveTree(tree: TreeType, alertSuccess = false) {
    // Only save the tree structure data
    const {data} = tree;

    database.updateTree(treeId, {data: data})
      .then(() => {
        setTree(tree);
        if (alertSuccess) {
          toast.success('Tree saved');
        }
      })
      .catch((err) => {
        toast.error(err?.message || 'Unknown error occurred saving the tree!', {autoClose: false});
      });
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
  );
}
