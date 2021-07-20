import React, { Component } from 'react'
import get from 'lodash.get'
import PeopleSelect from '../PeopleSelect'
import styles from './styles.scss'

class Partners extends Component {
  constructor (props) {
    super(props)

    const partners = get(props, 'node.partners')
    this.state = {
      partners
    }

    this.handleAddPartner = this.handleAddPartner.bind(this)
    this.removePartner = this.removePartner.bind(this)
    this.partnersUpdated = this.partnersUpdated.bind(this)
    this.handleSaveNodePartners = this.handleSaveNodePartners.bind(this)
    this.handleClose = props.close
  }

  handleAddPartner () {
    const partners = this.state.partners.concat([{
      people: [],
      type: 'PARTNER'
    }])

    this.setState({
      partners
    })
  }

  removePartner (index) {
    const arr = this.state.partners
    const partners = [...arr.slice(0, index), ...arr.slice(index + 1)]

    this.setState({
      partners
    })
  }

  partnersUpdated (partnerRowIndex, partnerRowState) {
    const newPartners = this.state.partners.map((partnerObject, index) => {
      if (index !== partnerRowIndex) {
        return partnerObject
      }

      const partners = get(partnerRowState, 'partners') || []

      return {
        type: partnerRowState.type,
        people: partners.map((partner) => {
          return this.props.people.find(person => person._id === partner.value)
        })
      }
    })

    this.setState({
      partners: newPartners
    })
  }

  handleSaveNodePartners () {
    const newNodeData = {
      partners: this.state.partners
    }

    this.props.onSave(newNodeData)
    this.props.close()
  }

  render () {
    const { partners } = this.state
    const people = this.props.people.map(person => {
      return { label: `${person.firstName} ${person.lastName}`, value: person._id }
    })

    return (
      <div>
        <h2>Persons Partners</h2>
        <p>Add partners by using the "Add Partner" button and selecting Sims.</p>
        <button className='btn btn-primary' onClick={this.handleAddPartner}><i className='icon-plus' /> Add Partner</button>

        {partners.map((partner, index) => {
          return (
            <PartnerRow
              key={index}
              index={index}
              partner={partner}
              people={people}
              partnersUpdated={this.partnersUpdated}
              removePartner={this.removePartner}
            />
          )
        })}

        <button className='btn btn-default' onClick={this.handleClose}>Cancel</button>
        <button className='btn btn-primary' onClick={this.handleSaveNodePartners}>Save</button>
      </div>
    )
  }
};

class PartnerRow extends Component {
  constructor (props) {
    super(props)

    const partnerPeople = get(props, 'partner.people')
    const partners = partnerPeople.map(person => {
      return { label: `${person.firstName} ${person.lastName}`, value: person._id }
    })
    const type = get(props, 'partner.partnerType', 'PARTNER')
    this.state = {
      partners,
      type
    }

    this.handleTypeChange = this.handleTypeChange.bind(this)
    this.handlePeopleChange = this.handlePeopleChange.bind(this)
    this.handleRemovePartner = this.handleRemovePartner.bind(this)
  }

  handleTypeChange (event) {
    this.setState({
      type: event.target.value
    }, () => {
      this.props.partnersUpdated(this.props.index, this.state)
    })
  }

  handlePeopleChange (partners) {
    this.setState({
      partners
    }, () => {
      this.props.partnersUpdated(this.props.index, this.state)
    })
  }

  handleRemovePartner () {
    this.props.removePartner(this.props.index)
  }

  render () {
    const { people, index } = this.props
    const { partners, type } = this.state

    return (
      <div className={styles.partnerTile}>
        <div className='form-group'>
          <label>Partner Sim(s)</label>
          <PeopleSelect
            options={people}
            onValuesChange={this.handlePeopleChange}
            defaultValues={partners}
          />
        </div>

        <div className='form-group'>
          <label>Partner Type</label>
          <input id={`partner-${index}`} type='radio' name={`type-${index}`} value='PARTNER' checked={type === 'PARTNER'} onChange={this.handleTypeChange} />
          <label className='radio' htmlFor={`partner-${index}`}>
            <span /> Partner
          </label>
          <input id={`ex-partner-${index}`} type='radio' name={`type-${index}`} value='EX_PARTNER' checked={type === 'EX_PARTNER'} onChange={this.handleTypeChange} />
          <label className='radio' htmlFor={`ex-partner-${index}`}>
            <span /> Ex-Partner
          </label>
          <input id={`married-${index}`} type='radio' name={`type-${index}`} value='MARRIED' checked={type === 'MARRIED'} onChange={this.handleTypeChange} />
          <label className='radio' htmlFor={`married-${index}`}>
            <span /> Married
          </label>
          <input id={`abduction-${index}`} type='radio' name={`type-${index}`} value='ABDUCTION' checked={type === 'ABDUCTION'} onChange={this.handleTypeChange} />
          <label className='radio' htmlFor={`abduction-${index}`}>
            <span /> Abduction
          </label>
        </div>
        <button className='btn btn-danger' onClick={this.handleRemovePartner}>Remove Partner</button>
      </div>
    )
  }
}

export default Partners
