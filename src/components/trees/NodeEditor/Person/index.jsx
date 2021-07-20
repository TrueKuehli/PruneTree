import React, { Component } from 'react'
import get from 'lodash.get'

import PersonSelect from '../PersonSelect'
import styles from './styles.scss'
import defaultAvatar from '../../../../common/images/default-avatar.png'
import { getUploadedImageUri } from '../../../../common/js/utils'

class NodePerson extends Component {
  constructor (props) {
    super(props)

    const personId = get(props, 'node.person._id')
    const person = this.props.people.find(person => person._id === personId)

    this.state = {
      person
    }

    this.handleSaveNodePerson = this.handleSaveNodePerson.bind(this)
    this.handleClose = props.close
  }

  selectPerson (personId) {
    const person = this.props.people.find(person => person._id === personId)

    this.setState({
      person
    })
  }

  handleSaveNodePerson () {
    const newNodeData = {
      person: this.state.person
    }

    this.props.onSave(newNodeData)
    this.props.close()
  }

  render () {
    const { person } = this.state
    const backgroundImage = get(person, 'avatar') ? `url(${getUploadedImageUri(person.avatar)})` : `url(${defaultAvatar})`
    const people = this.props.people.map(person => {
      return { label: `${person.firstName} ${person.lastName}`, value: person._id }
    })
    const defaultValue = person ? { label: `${person.firstName} ${person.lastName}`, value: person._id } : null

    return (
      <div>
        <h2>Node Person</h2>
        <p>Select the primary person for this node.</p>
        <div className={styles.personDetailsAvatar} style={{ backgroundImage }} />

        <div className='form-group'>
          <PersonSelect
            options={people}
            onValueChange={(selected) => this.selectPerson(selected.value)}
            defaultValue={defaultValue}
          />
        </div>

        <button className='btn btn-default' onClick={this.handleClose}>Cancel</button>
        <button className='btn btn-primary' onClick={this.handleSaveNodePerson}>Save</button>
      </div>
    )
  }
};

export default NodePerson
