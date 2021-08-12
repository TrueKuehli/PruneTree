import React, { useState } from 'react'
import get from 'lodash.get'
import PeopleSelect from '../PeopleSelect'

export default ({ node, people, onSave, close }) => {
  const [conception, setConception] = useState(get(node, 'data.parentType', 'NONE'))
  const [parents, setParents] = useState(get(node, 'data.parents', [])
    .map(person => ({ label: `${person.firstName} ${person.lastName}`, value: person._id })))
  const [adoptiveParents, setAdoptiveParents] = useState(get(node, 'data.adoptiveParents', [])
    .map(person => ({ label: `${person.firstName} ${person.lastName}`, value: person._id })))

  function handleConceptionChange (event) {
    setConception(event.target.value)
  }

  function handleSaveNodeParents () {
    const newNodeData = {
      parentType: conception,
      parents: parents.map((parent) => people.find(person => person._id === parent.value)),
      adoptiveParents: adoptiveParents.map((parent) => people.find(person => person._id === parent.value))
    }

    onSave(newNodeData)
    close()
  }

  const peopleOptions = people.map(person => {
    return { label: `${person.firstName} ${person.lastName}`, value: person._id }
  })

  return (
    <div>
      <h2>Persons Parents</h2>
      <p>You can add the details about this node persons parents. These might not be the people you choose to show in the tree above this node.</p>
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
        <input id='parent-type-none' type='radio' name='parentType' value='NONE' checked={conception === 'NONE'} onChange={handleConceptionChange} />
        <label className='radio' htmlFor='parent-type-none'>
          <span /> WooHoo
        </label>
        <input id='parent-type-abduction' type='radio' name='parentType' value='ABDUCTION' checked={conception === 'ABDUCTION'} onChange={handleConceptionChange} />
        <label className='radio' htmlFor='parent-type-abduction'>
          <span /> Alien Abduction
        </label>
        <input id='parent-type-clone' type='radio' name='parentType' value='CLONE' checked={conception === 'CLONE'} onChange={handleConceptionChange} />
        <label className='radio' htmlFor='parent-type-clone'>
          <span /> Cloning
        </label>
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
  )
}
