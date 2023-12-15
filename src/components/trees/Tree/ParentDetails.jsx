import React, {useEffect, useState} from 'react'
import styles from './styles.scss'
import defaultAvatar from '../../../common/images/default-avatar.png'
import { getImageUri } from '../../../common/js/utils'

export default ({avatar, firstName, lastName}) => {
  const [avatarURI, setAvatarURI] = useState(null)

  useEffect(() => {
    if (avatar) {
      getImageUri(avatar).then(uri => {
        setAvatarURI(uri)
      })
    }
  }, [avatar])

  const backgroundImage = avatarURI ? `url(${avatarURI.url})` : `url(${defaultAvatar})`

  return (
    <div className={styles.parentRow}>
      <div className={styles.parentAvatar} style={{ backgroundImage }} />
      <span className='person-details-biological-parent-name'>{firstName} {lastName}</span>
    </div>
  )
}
