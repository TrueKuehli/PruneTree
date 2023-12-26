import React, {useState, useEffect, FormEvent} from 'react';
import {Link, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';

import database from '../../../common/scripts/database';
import Loading from '../../Loading';

import styles from './styles.scss';
import {PersonLink} from '../../../common/scripts/types';
import {parseID} from '../../../common/scripts/utils';


/**
 * Person linker page component, allowing a user to link a person to another tree.
 */
export default function PersonLinker() {
  const params = useParams();
  const {treeId, personId} = params;
  const [title, setTitle] = useState('');
  const [person, setPerson] = useState('');
  const [tree, setTree] = useState('');
  const [links, setLinks] = useState<PersonLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    database.getPerson(personId)
      .then((response) => {
        const links = response?.links || [];
        setLoading(false);
        setLinks(links);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.message || 'Unknown error occurred',
          {autoClose: false, toastId: `person-load-fail-${personId}`});
      });
  }, [personId]);

  /**
   * On form submit, add the new link to the person.
   * @param event The form submit event.
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    links.push({
      title,
      treeId: parseID(tree),
      personId: parseID(person),
    });

    database.updatePerson(personId, {links})
      .then((response) => {
        toast.success('Person links updated');
        setLinks(response.links);
      })
      .catch((err) => {
        toast.error(err?.message || 'Unknown error occurred updating persons links', {autoClose: false});
      });
  }

  /**
   * Delete a link from the person.
   * @param linkData The link to delete.
   */
  function deleteLink(linkData: PersonLink) {
    const newLinks = links.filter((link) => {
      return link !== linkData;
    });

    database.updatePerson(personId, {links: newLinks})
      .then((response) => {
        toast.success('Person links updated');
        setLinks(response.links);
      })
      .catch((err) => {
        toast.error(err?.message || 'Unknown error occurred updating persons links', {autoClose: false});
      });
  }

  const cancelClass = [styles.formBtn, 'btn', 'btn-default'].join(' ');
  const submitClass = [styles.formBtn, 'btn', 'btn-primary'].join(' ');
  const cancelLink = `/trees/${treeId}/people`;

  return (
    loading ? <Loading message='Loading Person Links' /> :

    <div className='container'>
      <h1>Link Person</h1>
      <p>If this person is also in another tree elsewhere you can link the two trees via this person.</p>
      <p>You'll need the tree ID and the ID of the person you want to link to from that tree.</p>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input id='link-tree-title' className='form-control' type='text' name='title' placeholder='My Other Tree'
                 value={title} onChange={(ev) => setTitle(ev.target.value)} />
        </div>
        <div className='form-group'>
          <label>Tree ID</label>
          <input id='link-tree-id' className='form-control' type='text' name='tree' value={tree}
                 onChange={(ev) => setTree(ev.target.value)} />
        </div>
        <div className='form-group'>
          <label>Person ID</label>
          <input id='link-tree-person' className='form-control' type='text' name='person' value={person}
                 onChange={(ev) => setPerson(ev.target.value)} />
        </div>
        <Link className={cancelClass} to={cancelLink}><i className='icon-chevron-left' /> Back to Tree People</Link>
        <button id='submit-tree-link' type='submit' className={submitClass}>
          <i className='icon-plus' />  Link Person
        </button>
      </form>
      <h2>Existing Links</h2>

      {links.length ?
        (
          <p>
            Here's the links to other trees this person already has. Remember a Sim can be linked to multiple trees.
          </p>
        ) :
        (
          <p>Links you add/create will appear here.</p>
        )
      }

      {links.map((linkData, index) => {
        return (
          <div key={index} className={styles.linkTile}>
            <div className={styles.linkMenu}>
              <button className='btn btn-small btn-danger' onClick={() => deleteLink(linkData)}>Delete</button>
            </div>
            <div className={styles.linkDetails}>
              <a id={`link-info-title-${index}`} href='/'>
                {linkData.title || 'Unnamed Link'} <i className='icon-link' />
              </a>
              <div id={`link-info-tree-${index}`}><strong>Tree Id:</strong> {linkData.treeId}</div>
              <div id={`link-info-person-${index}`}><strong>Person Id:</strong> {linkData.personId}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
