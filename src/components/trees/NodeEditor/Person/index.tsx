import React, {useEffect, useState} from 'react';
import {HierarchyPointNode} from 'd3';

import {Person as PersonType, TreePersonNode} from '../../../../common/scripts/types';
import {getImageUri, ImageURL} from '../../../../common/scripts/dataUrl';
import PersonSelect from '../PersonSelect';

import styles from './styles.scss';
import defaultAvatar from '../../../../common/images/default-avatar.png';


type Props = {
  node: HierarchyPointNode<TreePersonNode>,
  people: PersonType[],
  onSave: (data: Partial<TreePersonNode>) => void,
  close: () => void,
}


/**
 * The Person component renders the editor for a node's person.
 * @param node The node to edit.
 * @param people The people in the tree.
 * @param onSave The function to call to save the node person.
 * @param close The function to call to close the editor.
 */
export default function Person({node, people, onSave, close}: Props) {
  const personId = node?.data?.person?._id as number;
  const [person, setPerson] =
    useState(people.find((person) => person._id === personId));
  const [avatarURI, setAvatarURI] =
    useState<ImageURL>(null);

  useEffect(() => {
    if (person && person.avatar) {
      getImageUri(person.avatar).then(setAvatarURI);
    }
  }, [person]);

  /**
   * Callback for selecting a person and setting the state.
   * @param personId The ID of the person to select.
   */
  function selectPerson(personId: number) {
    setPerson(people.find((person) => person._id === personId));
  }

  /**
   * Handle saving the node person.
   */
  function handleSaveNodePerson() {
    onSave({person: {_id: person._id}});
    close();
  }

  const backgroundImage = avatarURI ? `url(${avatarURI.url})` : `url(${defaultAvatar})`;
  const peopleOptions = people.map((person) => {
    const name = [person?.firstName, person?.lastName].filter(Boolean).join(' ') || 'Unnamed Sim';
    return {label: name, value: person._id as number};
  });
  const name = [person?.firstName, person?.lastName].filter(Boolean).join(' ') || 'Unnamed Sim';
  const defaultValue = person ?
    {label: name, value: person._id as number} :
    null;

  return (
    <div>
      <h2>Node Person</h2>
      <p>Select the primary person for this node.</p>
      <div className={styles.personDetailsAvatar} style={{backgroundImage}} />

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
  );
}
