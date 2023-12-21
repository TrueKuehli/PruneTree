import React from 'react';
import Select from 'react-select';

import REACT_SELECT_CUSTOM_STYLES from '../utils';


type Props = {
  options: {value: number, label: string}[],
  onValueChange: (value: {value: number, label: string}) => void,
  defaultValue: {value: number, label: string},
  inputId: string,
}


/**
 * The PeopleSelect component renders a select box for people.
 * @param options The options to render.
 * @param onValueChange The function to call when the value changes.
 * @param defaultValue The default value of the input.
 * @param inputId The ID of the input.
 */
export default function PersonSelect({options, onValueChange, defaultValue, inputId}: Props) {
  return (
    <Select
      defaultValue={defaultValue}
      onChange={onValueChange}
      isClearable={false}
      isSearchable
      options={options}
      styles={REACT_SELECT_CUSTOM_STYLES}
      inputId={inputId}
    />
  );
}
