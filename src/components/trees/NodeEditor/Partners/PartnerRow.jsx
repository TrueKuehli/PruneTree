import React, { useState, useEffect } from 'react'
import get from 'lodash.get'
import PeopleSelect from '../PeopleSelect'
import styles from './styles.scss'

export default ({ partner, people, index, onChange, onRemove }) => {
  const [type, setType] = useState(get(partner, 'type', 'PARTNER'))
  const [partners, setPartners] = useState(get(partner, 'people', [])
    .map(p => ({ label: `${p.firstName} ${p.lastName}`, value: p._id })))

  useEffect(() => {
    onChange(index, {
      type,
      partners
    })
  }, [type, partners])

  function handleTypeChange (event) {
    setType(event.target.value)
  }

  function handleRemovePartner () {
    onRemove(index)
  }

  return (
    <div className={styles.partnerTile}>
      <div className='form-group'>
        <label>Partner Sim(s)</label>
        <PeopleSelect
          inputId={`node-partner-select-${index}`}
          options={people}
          onValuesChange={setPartners}
          defaultValues={partners}
        />
      </div>

      <div className='form-group'>
        <label>Partner Type</label>
        <input id={`partner-${index}`} type='radio' name={`type-${index}`} value='PARTNER' checked={type === 'PARTNER'} onChange={handleTypeChange} />
        <label id={`partner-label-${index}`} className='radio' htmlFor={`partner-${index}`}>
          <span /> Partner
        </label>
        <input id={`ex-partner-${index}`} type='radio' name={`type-${index}`} value='EX_PARTNER' checked={type === 'EX_PARTNER'} onChange={handleTypeChange} />
        <label id={`ex-partner-label-${index}`} className='radio' htmlFor={`ex-partner-${index}`}>
          <span /> Ex-Partner
        </label>
        <input id={`married-${index}`} type='radio' name={`type-${index}`} value='MARRIED' checked={type === 'MARRIED'} onChange={handleTypeChange} />
        <label id={`married-label-${index}`} className='radio' htmlFor={`married-${index}`}>
          <span /> Married
        </label>
        <input id={`abduction-${index}`} type='radio' name={`type-${index}`} value='ABDUCTION' checked={type === 'ABDUCTION'} onChange={handleTypeChange} />
        <label id={`abduction-label-${index}`} className='radio' htmlFor={`abduction-${index}`}>
          <span /> Abduction
        </label>
      </div>
      <button className='btn btn-danger' onClick={handleRemovePartner}>Remove Partner</button>
    </div>
  )
}
