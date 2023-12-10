import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'
import defaultAvatar from '../../../common/images/default-avatar.png'
import RawHTML from '../../RawHTML'
import { getUploadedImageUri } from '../../../common/scripts/utils'

export default ({
  personId,
  treeId,
  traits = [],
  aspirations = [],
  lifeStates = [],
  parentType = 'NONE',
  parents = [],
  adoptiveParents = [],
  custom = [],
  avatar,
  style,
  readonly,
  closeDetails,
  firstName,
  lastName,
  bio
}) => {
  const [linkDataVisible, setLinkDataVisible] = useState(false)

  function handleToggleLinkData () {
    setLinkDataVisible(!linkDataVisible)
  }

  const inlineAvatarStyle = {}
  if (avatar) {
    inlineAvatarStyle.backgroundImage = `url(${getUploadedImageUri(avatar, '200x200')})`
  } else {
    inlineAvatarStyle.backgroundImage = `url(${defaultAvatar})`
  }

  return (
    <div className={styles.personDetails} style={style}>
      {!readonly && (
        <Link className={styles.editButton} to={`/trees/${treeId}/people/${personId}`}>
          <span>Edit</span>
        </Link>
      )}
      <div id='close-person-details' className={styles.closeButton} onClick={() => closeDetails()}>
        <span>Close</span>
      </div>
      <div className={styles.personDetailsTop}>
        <div className={styles.personDetailsAvatar} style={inlineAvatarStyle} />
        <h2 id='person-details-name'>{firstName} {lastName}</h2>
      </div>
      <div>
        <RawHTML html={bio} />
      </div>

      {parents.length > 0 && (
        <div>
          <h3 id='person-details-biological-parents-title'>Biological Parents <ParentType type={parentType} /></h3>
          <div>
            {parents.map((parent, index) => {
              const backgroundImage = parent.avatar ? `url(${getUploadedImageUri(parent.avatar, '200x200')})` : `url(${defaultAvatar})`
              return (
                <div className={styles.parentRow} key={index}>
                  <div className={styles.parentAvatar} style={{ backgroundImage }} />
                  <span className='person-details-biological-parent-name'>{parent.firstName} {parent.lastName}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {adoptiveParents.length > 0 && (
        <div>
          <h3>Adoptive Parents</h3>
          <div>
            {adoptiveParents.map((parent, index) => {
              const backgroundImage = parent.avatar ? `url(${getUploadedImageUri(parent.avatar, '200x200')})` : `url(${defaultAvatar})`
              return (
                <div className={styles.parentRow} key={index}>
                  <div className={styles.parentAvatar} style={{ backgroundImage }} />
                  <span>{parent.firstName} {parent.lastName}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {traits.length > 0 && (
        <div>
          <h3>Traits</h3>
          <div>
            {traits.map((trait, index) => {
              return <span className={styles.tag} key={index}>{trait}</span>
            })}
          </div>
        </div>
      )}

      {aspirations.length > 0 && (
        <div>
          <h3>Aspirations</h3>
          <div>
            {aspirations.map((aspiration, index) => {
              return <span className={styles.tag} key={index}>{aspiration}</span>
            })}
          </div>
        </div>
      )}

      {lifeStates.length > 0 && (
        <div>
          <h3>Life States</h3>

          {lifeStates.map((lifeState, index) => {
            return <span className={styles.tag} key={index}>{lifeState}</span>
          })}
        </div>
      )}

      {custom.length > 0 && (
        <div>
          <h3>More</h3>

          <table className='table'>
            <tbody>
              {custom.map((item, index) => {
                return (
                  <tr key={index}>
                    <th scope='row'>{item.title}</th>
                    <td>{item.value}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.linkDetailsToggle} onClick={handleToggleLinkData}>{linkDataVisible ? 'Hide Link Details' : 'Show Link Details'}</div>
      {linkDataVisible && (
        <div className={styles.linkDetails}>
          <div>Tree Id <code>{treeId}</code></div>
          <div>Person Id <code>{personId}</code></div>
        </div>
      )}
    </div>
  )
}

const ParentType = ({ type }) => {
  if (type === 'CLONE') {
    return (<span className='label label-blue'>Clone</span>)
  } else if (type === 'ABDUCTION') {
    return (<span className='label label-green'>Alien Abduction</span>)
  } else {
    return null
  }
}
