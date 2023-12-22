import React, {ChangeEvent, useState} from 'react';
import {HierarchyPointNode} from 'd3';

import {CONCEPTION_TYPES, ConceptionType} from '../../../../common/scripts/conceptionTypes';
import {TreePersonNode} from '../../../../common/scripts/types';
import {Person} from '../../../../common/scripts/types';
import PeopleSelect from '../PeopleSelect';


type Props = {
  node: HierarchyPointNode<TreePersonNode>,
  people: Person[],
  onSave: (newNodeData: Partial<TreePersonNode>) => void,
  close: () => void,
}


/**
 * The Parents component renders the editor for a node's parents.
 * @param node The node to edit.
 * @param people The people in the tree.
 * @param onSave The function to call to save the node.
 * @param close The function to call to close the editor.
 */
export default function Parents({node, people, onSave, close}: Props) {
  const [conception, setConception] =
    useState(node?.data?.parentType || CONCEPTION_TYPES[0]);
  const [parents, setParents] =
    useState((node?.data?.parents || [])
      .map((person) => {
        const name = [person?.firstName, person?.lastName].filter(Boolean).join(' ') || 'Unnamed Sim';
        return {label: name, value: person._id as number};
      }));
  const [adoptiveParents, setAdoptiveParents] =
    useState((node?.data?.adoptiveParents || [])
      .map((person) => {
        const name = [person?.firstName, person?.lastName].filter(Boolean).join(' ') || 'Unnamed Sim';
        return {label: name, value: person._id as number};
      }));

  /**
   * Handle the change of the conception type.
   * @param event The change event.
   */
  function handleConceptionChange(event: ChangeEvent<HTMLInputElement>) {
    setConception(event.target.value as ConceptionType);
  }

  /**
   * Handle the saving of the node parents.
   */
  function handleSaveNodeParents() {
    const findPerson = ({value}: {label: string, value: number}) =>
      people.find((person) => person._id === value);
    const newNodeData = {
      parentType: conception,
      parents: parents.map(findPerson),
      adoptiveParents: adoptiveParents.map(findPerson),
    };

    onSave(newNodeData);
    close();
  }

  const peopleOptions = people.map((person) => {
    const name = [person?.firstName, person?.lastName].filter(Boolean).join(' ') || 'Unnamed Sim';
    return {label: name, value: person._id as number};
  });

  return (
    <div>
      <h2>Persons Parents</h2>
      <p>
        You can add the details about this node persons parents. These might not be the people
        you choose to show in the tree above this node.
      </p>

      <h3>Biological Parents</h3>
      <div className='form-group'>
        <label>Parents</label>
        <PeopleSelect
          inputId='node-parents-select'
          options={peopleOptions}
          onValuesChange={setParents}
          defaultValues={parents}
        />
      </div>

      <div className='form-group'>
        <label>Sims Conception</label>
        {
          CONCEPTION_TYPES.map((type) => {
            const id = `parent-type-${type.replace(/\W/, '').toLowerCase()}`;
            return (
              <React.Fragment key={type}>
                <input id={id} type='radio' name='parentType' value={type} checked={conception === type}
                       onChange={handleConceptionChange} />
                <label className='radio' htmlFor={id}>
                  <span /> {type}
                </label>
              </React.Fragment>
            );
          })
        }
      </div>

      <h3>Adoptive Parents</h3>
      <div className='form-group'>
        <label>Parents</label>
        <PeopleSelect
          inputId='node-adoptive-parents-select'
          options={peopleOptions}
          onValuesChange={setAdoptiveParents}
          defaultValues={adoptiveParents}
        />
      </div>

      <button className='btn btn-default' onClick={close}>Cancel</button>
      <button id='save-node-parents' className='btn btn-primary' onClick={handleSaveNodeParents}>Save</button>
    </div>
  );
}
