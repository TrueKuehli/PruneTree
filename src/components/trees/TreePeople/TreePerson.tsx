import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';

import {Person} from '../../../common/scripts/types';
import {getImageUri, ImageURL} from '../../../common/scripts/dataUrl';

import styles from './styles.scss';
import defaultAvatar from '../../../common/images/default-avatar.png';


type Props = {
  treeId: number,
  person: Person,
  deletePerson: (personId: number) => void
}


/**
 * Filter the people in the tree.
 * @param treeId The ID of the tree.
 * @param person The person to render.
 * @param deletePerson The function to call when the person is deleted.
 */
export default function TreePerson({treeId, person, deletePerson}: Props) {
  const personEditLink = `/trees/${treeId}/people/${person._id}`;
  const personLinkLink = `/trees/${treeId}/people/${person._id}/link`;

  const [avatarURI, setAvatarURI] = useState<ImageURL>(null);

  if (person.avatar) {
    getImageUri(person.avatar).then((uri) => {
      setAvatarURI(uri);
    }).catch((err) => {
      toast.error(err?.message || 'Unknown error occurred', {autoClose: false});
    });
  }

  const backgroundImage = avatarURI ? `url(${avatarURI.url})` : `url(${defaultAvatar})`;
  const inlineAvatarStyle = {backgroundImage};

  const name = [person?.firstName, person?.lastName].filter(Boolean).join(' ');

  return (
    <div className={`${styles.personTile} people-list-item`}>
      <div className={styles.avatar} style={inlineAvatarStyle} />
      <div>{name}</div>
      <div className={styles.personMenu}>
        <Link className='btn btn-small btn-default edit-person' to={personEditLink}>Edit</Link>
        <Link className='btn btn-small btn-default link-person' to={personLinkLink}>Link</Link>
        <button className='btn btn-small btn-danger delete-person' onClick={() => deletePerson(person._id as number)}>
          Delete
        </button>
      </div>
    </div>
  );
}
