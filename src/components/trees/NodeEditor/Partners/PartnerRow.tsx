import React, {useState, useEffect} from 'react';

import {PARTNER_TYPES, PartnerType} from '../../../../common/scripts/partnerTypes';
import PeopleSelect from '../PeopleSelect';

import styles from './styles.scss';
import {PartnerData} from '../../../../common/scripts/types';


type PartnerOption = {
  label: string,
  value: number,
}

type Props = {
  index: number,
  partner: PartnerData,
  people: PartnerOption[],
  onChange: (index: number, partner: {type: PartnerType, partners: PartnerOption[]}) => void,
  onRemove: (index: number) => void,
}


/**
 * Component used to render a single partner edit row.
 * @param index The index of the partner.
 * @param partner The partner data to render.
 * @param people The people in the tree.
 * @param onChange Callback to change the partner data.
 * @param onRemove Callback to remove the partner.
 * @constructor
 */
export default function PartnerRow({index, partner, people, onChange, onRemove}: Props) {
  const [type, setType] =
    useState(partner?.type || PARTNER_TYPES[0]);
  const [partners, setPartners] =
    useState((partner?.people || [])
      .map((p) => ({label: `${p.firstName} ${p.lastName}`, value: p._id as number})));

  useEffect(() => {
    onChange(index, {
      type,
      partners,
    });
  }, [type, partners]);

  /**
   * Handle a change in the partner type.
   * @param event The change event.
   */
  function handleTypeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setType(event.target.value as PartnerType);
  }

  /**
   * Handles the removal of a partner.
   */
  function handleRemovePartner() {
    onRemove(index);
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
        {
          PARTNER_TYPES.map((partnerType) => {
            const id = `${partnerType}-${index}`;
            const labelId = `${partnerType}-label-${index}`;
            return (
              <React.Fragment key={partnerType}>
                <input id={id} type='radio' name={`type-${index}`} value={partnerType} checked={type === partnerType}
                       onChange={handleTypeChange} />
                <label id={labelId} className='radio' htmlFor={id}>
                  <span /> {partnerType}
                </label>
              </React.Fragment>
            );
          })
        }
      </div>
      <button className='btn btn-danger' onClick={handleRemovePartner}>Remove Partner</button>
    </div>
  );
}
