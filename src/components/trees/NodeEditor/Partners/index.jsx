import React, { useState } from 'react'
import get from 'lodash.get'
import PartnerRow from './PartnerRow'

export default ({ node, people, onSave, close }) => {
  const [partners, setPartners] = useState(get(node, 'data.partners', []))

  function handleAddPartner () {
    setPartners(partners.concat([{
      people: [],
      type: 'PARTNER'
    }]))
  }

  function removePartner (index) {
    setPartners([...partners.slice(0, index), ...partners.slice(index + 1)])
  }

  function partnerUpdated (partnerRowIndex, partner) {
    const { type, partners: partnerRowPartners } = partner
    const newPartner = {
      type,
      people: partnerRowPartners.map((partner) => people.find(person => person._id === partner.value))
    }

    const newPartners = partners
      .map((originalPartner, index) => index === partnerRowIndex ? newPartner : originalPartner)

    setPartners(newPartners)
  }

  function handleSaveNodePartners () {
    onSave({ partners })
    close()
  }

  const peopleOptions = people.map(person => {
    return { label: `${person.firstName} ${person.lastName}`, value: person._id }
  })

  return (
    <div>
      <h2>Persons Partners</h2>
      <p>Add partners by using the "Add Partner" button and selecting Sims.</p>
      <button id='add-node-partner' className='btn btn-primary' onClick={handleAddPartner}><i className='icon-plus' /> Add Partner</button>

      {partners.map((partner, index) => {
        return (
          <PartnerRow
            key={index}
            index={index}
            partner={partner}
            people={peopleOptions}
            onChange={partnerUpdated}
            onRemove={removePartner}
          />
        )
      })}

      <button className='btn btn-default' onClick={close}>Cancel</button>
      <button id='save-node-partners' className='btn btn-primary' onClick={handleSaveNodePartners}>Save</button>
    </div>
  )
}
