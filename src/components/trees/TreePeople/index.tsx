import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';

import {Person, Tree, TreePersonNode} from '../../../common/scripts/types';
import {parseID} from '../../../common/scripts/utils';
import database from '../../../common/scripts/database';
import Loading from '../../Loading';
import TreePerson from './TreePerson';

import styles from './styles.scss';


/**
 * The people editor page.
 */
export default function TreePeople() {
  const params = useParams();
  const {treeId} = params;
  const [loading, setLoading] = useState(true);
  const [people, setPeople] = useState<Person[]>([]);
  const [tree, setTree] = useState<Tree>(null);
  const [filter, setFilter] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);

  useEffect(() => {
    setLoading(true);

    const getTree = database.getTree(treeId);
    const getPeople = database.getPeople(treeId);

    Promise.all([getTree, getPeople])
      .then((response) => {
        const tree = response[0];
        const people = response[1];

        setPeople(people);
        setTree(tree);
        setFilter('');
        setFilteredPeople(people);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.message || 'Unknown error occurred', {autoClose: false});
      });
  }, [treeId]);

  /**
   * Filter the people in the tree.
   * @param event The on change event of the filter input.
   */
  function handleFilterPeople(event: React.ChangeEvent<HTMLInputElement>) {
    setFilter(event.target.value);
    setFilteredPeople(_filterPeople(people, event.target.value));
  }

  /**
   * Filter the given people by name using the filter string.
   * @param people The people to filter.
   * @param filter The filter string.
   */
  function _filterPeople(people: Person[], filter = '') {
    if (filter === '') {
      return people;
    }

    return people.filter((person) => {
      const name = `${person.firstName} ${person.lastName}`.toLowerCase();
      return name.includes(filter.toLowerCase());
    });
  }

  /**
   * Delete a person from the tree.
   * @param personId The ID of the person to delete.
   */
  function deletePerson(personId: number) {
    const deleteConfirmed = confirm('Are you sure you want to delete this person?');

    if (deleteConfirmed) {
      // Delete all references of this person in the tree
      const updatedTree = Object.assign({}, tree);
      _removePersonFromTree(personId, updatedTree.data);

      const updateTree = database.updateTree(treeId, {data: updatedTree.data});
      const deletePerson = database.deletePerson(personId);
      Promise.all([updateTree, deletePerson])
        .then(() => {
          setPeople(people.filter((person) => person._id !== personId));
          setFilteredPeople(filteredPeople.filter((person) => person._id !== personId));
          toast.success('Person removed');
        })
        .catch((err) => {
          toast.error(err?.message || 'Unknown error occurred', {autoClose: false});
        });
    }
  }

  /**
   * Remove all references to a person from the tree.
   * @param personId The ID of the person to remove.
   * @param treeNode The tree node to remove the person from.
   */
  function _removePersonFromTree(personId: number, treeNode: TreePersonNode) {
    if (treeNode.person?._id === personId) {
      treeNode.person = null;
    }

    if (treeNode.adoptiveParents?.length) {
      treeNode.adoptiveParents = treeNode.adoptiveParents.filter((parent) => parent._id !== personId);
    }
    if (treeNode.parents?.length) {
      treeNode.parents = treeNode.parents.filter((parent) => parent._id !== personId);
    }
    if (treeNode.partners?.length) {
      treeNode.partners.forEach((partnerRow) => {
        if (partnerRow.people?.length) {
          partnerRow.people = partnerRow.people.filter((partner) => partner._id !== personId);
        }
      });
    }
    if (treeNode.children?.length) {
      treeNode.children.forEach((child) => _removePersonFromTree(personId, child));
    }
  }

  const personCreateLink = `/trees/${treeId}/people/add`;

  return (
    loading ? <Loading message='Loading people' /> :

    <div className='container'>
      <h1>Manage People in Your Tree</h1>
      <p>
        Here you can create people to place in the structure of your family tree or edit existing people
        already in the tree.
      </p>
      <div className={styles.navButtons}>
        <Link id='back-to-tree' className='btn btn-default' to={`/trees/${treeId}`}>
          <i className='icon-chevron-left' /> Back to Your Tree
        </Link>
        <Link id='add-new-person' className='btn btn-primary' to={personCreateLink}>
          <i className='icon-plus' /> Add Someone New
        </Link>
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
        <TreePerson key={person._id as number} treeId={parseID(treeId)} person={person} deletePerson={deletePerson}/>,
      )}
    </div>
  );
}
