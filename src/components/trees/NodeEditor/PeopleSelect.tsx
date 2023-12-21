import React from 'react';
import Select from 'react-select';

import REACT_SELECT_CUSTOM_STYLES from '../utils';


type Props = {
  options: {value: number, label: string}[],
  onValuesChange: (values: {value: number, label: string}[]) => void,
  defaultValues: {value: number, label: string}[],
  inputId: string,
}


/**
 * The PeopleSelect component renders a select box for people.
 * @param options The options to render.
 * @param onValuesChange The function to call when the values change.
 * @param defaultValues The default values.
 * @param inputId The ID of the input.
 */
export default function PeopleSelect({options, onValuesChange, defaultValues, inputId}: Props) {
  return (
    <Select
      inputId={inputId}
      value={defaultValues}
      onChange={onValuesChange}
      options={options}
      isMulti
      isSearchable
      styles={REACT_SELECT_CUSTOM_STYLES}
    />
  );
}
