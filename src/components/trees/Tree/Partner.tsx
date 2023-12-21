import React from 'react';

import {PartnerData, Person as PersonType} from '../../../common/scripts/types';
import {ConceptionType} from '../../../common/scripts/conceptionTypes';
import Person from './Person';
import PartnerTypeSymbol from './PartnerTypeSymbol';


type Props = {
  partners: PartnerData[],
  partnerData: PartnerData,
  people: PersonType[],
  transform: string,
  highlightPeople: number[],
  showPersonDetails: (
    personId: number,
    parentType: ConceptionType,
    parentIds: number[],
    adoptiveParentIds: number[],
  ) => void,
}


/**
 * The Partner component renders a single partner in the tree.
 * @param partners The full list of partners of the main node.
 * @param partnerData The partner data to render.
 * @param people The people in the tree.
 * @param transform The transform to apply to the partner node.
 * @param highlightPeople The people to highlight.
 * @param showPersonDetails The function to call to show the person details.
 */
export default function Partner({partners, partnerData, people, transform, highlightPeople, showPersonDetails}: Props) {
  const nodePartners = partners;
  const partnerPeople = partnerData.people;
  const partnerType = partnerData.type;

  return (
    <g className='partner' transform={transform}>

      <PartnerTypeSymbol type={partnerType} />

      {partnerPeople.map((person, index) => {
        const small = nodePartners.length > 1 || index > 0;
        const personData = people.find((p) => p._id === person?._id);

        // Check if we need to mute/darken the node person.
        const personId = personData?._id as number;
        const mute = personId && highlightPeople && highlightPeople.length && !highlightPeople.includes(personId);

        return (
          <Person
            key={index}
            personData={personData}
            small={small}
            transform={`translate(${index * 35},0)`}
            showPersonDetails={showPersonDetails}
            mute={mute}
          />
        );
      })}
    </g>
  );
}
