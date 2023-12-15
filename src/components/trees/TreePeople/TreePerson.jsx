import {getImageUri} from "../../../common/js/utils";
import defaultAvatar from "../../../common/images/default-avatar.png";
import styles from "./styles.scss";
import {Link} from "react-router-dom";
import React, {useState} from "react";
import {toast} from "react-toastify";
import get from "lodash.get";


export default ({treeId, person, deletePerson}) => {
  const personEditLink = `/trees/${treeId}/people/${person._id}`
  const personLinkLink = `/trees/${treeId}/people/${person._id}/link`

  const [avatarURI, setAvatarURI] = useState(null)

  if (person.avatar) {
    getImageUri(person.avatar).then((uri) => {
      setAvatarURI(uri)

    }).catch((error) => {
      toast.error(get(error, 'message', 'Unknown error occurred'), { autoClose: false })
    })

  }

  const backgroundImage = avatarURI ? `url(${avatarURI.url})` : `url(${defaultAvatar})`

  const inlineAvatarStyle = { backgroundImage }
  let name
  if (person.firstName || person.lastName) {
    name = `${person.firstName} ${person.lastName}`.trim()
  } else {
    name = (<i>~ No Name ~</i>)
  }

  return (
    <div className={`${styles.personTile} people-list-item`}>
      <div className={styles.avatar} style={inlineAvatarStyle} />
      <div>{name}</div>
      <div className={styles.personMenu}>
        <Link className='btn btn-small btn-default edit-person' to={personEditLink}>Edit</Link>
        <Link className='btn btn-small btn-default link-person' to={personLinkLink}>Link</Link>
        <button className='btn btn-small btn-danger delete-person' onClick={() => deletePerson(person._id)}>Delete</button>
      </div>
    </div>
  )
}