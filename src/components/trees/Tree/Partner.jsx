import React from 'react'
import get from 'lodash.get'
import Person from './Person'
import PartnerType from './PartnerType'

export default ({ partners, partnerData, people, transform, highlightPeople, showPersonDetails }) => {
  const nodePartners = partners
  const partnerPeople = partnerData.people
  const partnerType = partnerData.type

  return (
    <g className='partner' transform={transform}>

      <PartnerType type={partnerType} />

      {partnerPeople.map((person, index) => {
        const small = nodePartners.length > 1 || index > 0
        const personData = people.find(p => p._id === get(person, '_id'))

        // check if we need to mute/darken the node person.
        const personId = get(personData, '_id')
        const mute = personId && highlightPeople && highlightPeople.length && !highlightPeople.includes(personId)

        return (
          <Person
            key={index}
            personData={personData}
            small={small}
            transform={`translate(${index * 35},0)`}
            showPersonDetails={showPersonDetails}
            mute={mute}
          />
        )
      })}
    </g>
  )
}
