import React, {useEffect, useState} from 'react';

import {getImageUri} from '../../../common/scripts/dataUrl';

import styles from './styles.scss';
import defaultAvatar from '../../../common/images/default-avatar.png';


type Props = {
  avatar?: number,
  firstName: string,
  lastName: string,
}


/**
 * The ParentDetails component is used to render the name and avatar of a Sim's parent.
 * @param avatar The avatar image ID of the parent.
 * @param firstName The first name of the parent.
 * @param lastName The last name of the parent.
 */
export default function ParentDetails({avatar, firstName, lastName}: Props) {
  const [avatarURI, setAvatarURI] = useState(null);

  useEffect(() => {
    if (avatar) {
      getImageUri(avatar).then((uri) => {
        setAvatarURI(uri);
      });
    }
  }, [avatar]);

  const name = [firstName, lastName].filter(Boolean).join(' ') || 'Unnamed Sim';
  const backgroundImage = avatarURI ? `url(${avatarURI.url})` : `url(${defaultAvatar})`;

  return (
    <div className={styles.parentRow}>
      <div className={styles.parentAvatar} style={{backgroundImage}} />
      <span className='person-details-biological-parent-name'>{name}</span>
    </div>
  );
}
