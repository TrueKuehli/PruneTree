import React, { Component } from 'react'
import Select from 'react-select'

class PeopleSelect extends Component {
  render () {
    const customStyles = {
      multiValue: (provided) => {
        return {
          ...provided,
          ...{
            background: '#3498db',
            borderRadius: 3,
            boxShadow: '0 2px 3px 0 rgba(0,0,0,.075)'
          }
        }
      },
      multiValueLabel: (provided) => {
        return {
          ...provided,
          ...{
            color: '#fff',
            padding: '3px 10px',
            textShadow: '0 1px 2px rgba(0,0,0,.2)',
            fontSize: 16,
            fontWeight: 300
          }
        }
      },
      multiValueRemove: (provided) => {
        return {
          ...provided,
          ...{
            color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,.2)',
            cursor: 'pointer',
            ':hover': {
              backgroundColor: '#2980b9',
              color: '#fff'
            }
          }
        }
      },
      control: (provided) => {
        return {
          ...provided,
          ...{
            borderColor: '#ccc',
            ':hover': {
              borderColor: 'rgba(26, 188, 156, 1)'
            }
          }
        }
      }
    }

    const {
      options,
      onValuesChange,
      defaultValues
    } = this.props

    return (
      <Select
        value={defaultValues}
        onChange={onValuesChange}
        options={options}
        isMulti
        isSearchable
        styles={customStyles}
      />
    )
  }
};

export default PeopleSelect
