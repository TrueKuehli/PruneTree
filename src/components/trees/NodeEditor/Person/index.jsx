import React, { useState } from 'react'
import get from 'lodash.get'
import PersonSelect from '../PersonSelect'
import styles from './styles.scss'
import defaultAvatar from '../../../../common/images/default-avatar.png'
import { getUploadedImageUri } from '../../../../common/js/utils'

export default ({ node, people, onSave, close }) => {
  const personId = get(node, 'data.person._id')
  const [person, setPerson] = useState(people.find(person => person._id === personId))

  function selectPerson (personId) {
    setPerson(people.find(person => person._id === personId))
  }

  function handleSaveNodePerson () {
    onSave({ person })
    close()
  }

  const backgroundImage = get(person, 'avatar') ? `url(${getUploadedImageUri(person.avatar, '200x200')})` : `url(${defaultAvatar})`
  const peopleOptions = people.map(person => {
    return { label: `${person.firstName} ${person.lastName}`, value: person._id }
  })
  const defaultValue = person ? { label: `${person.firstName} ${person.lastName}`, value: person._id } : null

  return (
    <div>
      <h2>Node Person</h2>
      <p>Select the primary person for this node.</p>
      <div className={styles.personDetailsAvatar} style={{ backgroundImage }} />

      <div className='form-group'>
        <PersonSelect
          inputId='node-person-select'
          options={peopleOptions}
          onValueChange={(selected) => selectPerson(selected.value)}
          defaultValue={defaultValue}
        />
      </div>

      <button className='btn btn-default' onClick={close}>Cancel</button>
      <button id='save-node-person' className='btn btn-primary' onClick={handleSaveNodePerson}>Save</button>
    </div>
  )
}
