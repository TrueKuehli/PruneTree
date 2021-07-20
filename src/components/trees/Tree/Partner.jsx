import React, { Component } from 'react'
import get from 'lodash.get'
import Person from './Person'
import PartnerType from './PartnerType'

class Partner extends Component {
  render () {
    const nodePartners = this.props.partners
    const partnerPeople = this.props.partnerData.people
    const partnerType = this.props.partnerData.type

    return (
      <g className='partner' transform={this.props.transform}>

        <PartnerType type={partnerType} />

        {partnerPeople.map((person, index) => {
          const small = nodePartners.length > 1 || index > 0
          const personData = this.props.people.find(p => p._id === get(person, '_id'))

          // check if we need to mute/darken the node person.
          const personId = get(personData, '_id')
          const highlightPeople = get(this.props, 'highlightPeople', [])
          const mute = personId && highlightPeople.length && !highlightPeople.includes(personId)

          return (
            <Person
              key={index}
              personData={personData}
              small={small}
              transform={`translate(${index * 35},0)`}
              showPersonDetails={this.props.showPersonDetails}
              mute={mute}
            />
          )
        })}
      </g>
    )
  }
};

export default Partner
