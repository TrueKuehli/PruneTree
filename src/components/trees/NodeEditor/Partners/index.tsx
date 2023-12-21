import React, {useState} from 'react';
import {HierarchyPointNode} from 'd3';

import {Person, TreePersonNode} from '../../../../common/scripts/types';
import {PARTNER_TYPES, PartnerType} from '../../../../common/scripts/partnerType';
import PartnerRow from './PartnerRow';


type Props = {
  node: HierarchyPointNode<TreePersonNode>,
  people: Person[],
  onSave: (node: Partial<TreePersonNode>) => void,
  close: () => void,
}


/**
 * The Partners component renders the partners for a node.
 * @param node The node to edit.
 * @param people The people in the tree.
 * @param onSave The function to call to save the node.
 * @param close The function to call to close the editor.
 * @constructor
 */
export default function Partners({node, people, onSave, close}: Props) {
  const [partners, setPartners] =
    useState(node?.data?.partners || []);

  /**
   * Add a new partner to the node.
   */
  function handleAddPartner() {
    setPartners(partners.concat([{
      people: [],
      type: PARTNER_TYPES[0],
    }]));
  }

  /**
   * Remove a partner from the node.
   * @param index The index of the partner to remove.
   */
  function removePartner(index: number) {
    setPartners([...partners.slice(0, index), ...partners.slice(index + 1)]);
  }

  /**
   * Update the partner at the specified index.
   * @param partnerRowIndex The index of the partner to update.
   * @param partner The new partner data.
   */
  function partnerUpdated(
    partnerRowIndex: number,
    {type, partners: partnerRowEntry}: {type: PartnerType, partners: {label: string, value: number}[]},
  ) {
    const newPartner = {
      type,
      people: partnerRowEntry.map((partner) =>
        people.find((person) => person._id === partner.value)),
    };

    const newPartners = partners
      .map((originalPartner, index) =>
        index === partnerRowIndex ? newPartner : originalPartner);

    setPartners(newPartners);
  }

  /**
   * Save the node partners.
   */
  function handleSaveNodePartners() {
    onSave({partners});
    close();
  }

  const peopleOptions = people.map((person) => {
    return {label: `${person.firstName} ${person.lastName}`, value: person._id as number};
  });

  return (
    <div>
      <h2>Persons Partners</h2>
      <p>Add partners by using the "Add Partner" button and selecting Sims.</p>
      <button id='add-node-partner' className='btn btn-primary' onClick={handleAddPartner}>
        <i className='icon-plus' /> Add Partner
      </button>

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
        );
      })}

      <button className='btn btn-default' onClick={close}>Cancel</button>
      <button id='save-node-partners' className='btn btn-primary' onClick={handleSaveNodePartners}>Save</button>
    </div>
  );
}
