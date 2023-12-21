import {CSSObjectWithLabel, StylesConfig} from 'react-select';

const REACT_SELECT_CUSTOM_STYLES: StylesConfig = {
  multiValue: (provided) => {
    return {
      ...provided,
      'background': '#3498db',
      'borderRadius': 3,
      'boxShadow': '0 2px 3px 0 rgba(0,0,0,.075)',
    } as CSSObjectWithLabel;
  },
  multiValueLabel: (provided) => {
    return {
      ...provided,
      'color': '#fff',
      'padding': '3px 10px',
      'textShadow': '0 1px 2px rgba(0,0,0,.2)',
      'fontSize': 16,
      'fontWeight': 300,
    } as CSSObjectWithLabel;
  },
  multiValueRemove: (provided) => {
    return {
      ...provided,
      'color': '#fff',
      'textShadow': '0 1px 2px rgba(0,0,0,.2)',
      'cursor': 'pointer',
      ':hover': {
        'backgroundColor': '#2980b9',
        'color': '#fff',
      },
    } as CSSObjectWithLabel;
  },
  control: (provided) => {
    return {
      ...provided,
      'borderColor': '#ccc',
      ':hover': {
        'borderColor': 'rgba(26, 188, 156, 1)',
      },
    } as CSSObjectWithLabel;
  },
};


export default REACT_SELECT_CUSTOM_STYLES;
