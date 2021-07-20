import React, { Component } from 'react'
import get from 'lodash.get'

import PeopleSelect from '../PeopleSelect'

class Parents extends Component {
  constructor (props) {
    super(props)

    const { node } = props

    const parents = get(node, 'parents', []).map(person => {
      return { label: `${person.firstName} ${person.lastName}`, value: person._id }
    })
    const adoptiveParents = get(node, 'adoptiveParents', []).map(person => {
      return { label: `${person.firstName} ${person.lastName}`, value: person._id }
    })

    this.state = {
      conception: node.parentType || 'NONE',
      parents,
      adoptiveParents
    }

    this.handleBiologicalParentsChange = this.handleBiologicalParentsChange.bind(this)
    this.handleConceptionChange = this.handleConceptionChange.bind(this)
    this.handleAdoptiveParentsChange = this.handleAdoptiveParentsChange.bind(this)
    this.handleSaveNodeParents = this.handleSaveNodeParents.bind(this)
    this.handleClose = props.close
  }

  handleBiologicalParentsChange (parents) {
    this.setState({
      parents
    })
  }

  handleConceptionChange (event) {
    this.setState({
      conception: event.target.value
    })
  }

  handleAdoptiveParentsChange (adoptiveParents) {
    this.setState({
      adoptiveParents
    })
  }

  handleSaveNodeParents () {
    const people = this.props.people
    const parents = get(this.state, 'parents') || []
    const adoptiveParents = get(this.state, 'adoptiveParents') || []
    const newNodeData = {
      parentType: this.state.conception,
      parents: parents.map((parent) => {
        return people.find(person => person._id === parent.value)
      }),
      adoptiveParents: adoptiveParents.map((parent) => {
        return people.find(person => person._id === parent.value)
      })
    }

    this.props.onSave(newNodeData)
    this.props.close()
  }

  render () {
    const people = this.props.people.map(person => {
      return { label: `${person.firstName} ${person.lastName}`, value: person._id }
    })
    const { conception, parents, adoptiveParents } = this.state

    return (
      <div>
        <h2>Persons Parents</h2>
        <p>You can add the details about this node persons parents. These might not be the people you choose to show in the tree above this node.</p>
        <h3>Biological Parents</h3>
        <div className='form-group'>
          <label>Parents</label>
          <PeopleSelect
            options={people}
            onValuesChange={this.handleBiologicalParentsChange}
            defaultValues={parents}
          />
        </div>

        <div className='form-group'>
          <label>Sims Conception</label>
          <input id='parent-type-none' type='radio' name='parentType' value='NONE' checked={conception === 'NONE'} onChange={this.handleConceptionChange} />
          <label className='radio' htmlFor='parent-type-none'>
            <span /> WooHoo
          </label>
          <input id='parent-type-abduction' type='radio' name='parentType' value='ABDUCTION' checked={conception === 'ABDUCTION'} onChange={this.handleConceptionChange} />
          <label className='radio' htmlFor='parent-type-abduction'>
            <span /> Alien Abduction
          </label>
          <input id='parent-type-clone' type='radio' name='parentType' value='CLONE' checked={conception === 'CLONE'} onChange={this.handleConceptionChange} />
          <label className='radio' htmlFor='parent-type-clone'>
            <span /> Cloning
          </label>
        </div>

        <h3>Adoptive Parents</h3>
        <div className='form-group'>
          <label>Parents</label>
          <PeopleSelect
            options={people}
            onValuesChange={this.handleAdoptiveParentsChange}
            defaultValues={adoptiveParents}
          />
        </div>

        <button className='btn btn-default' onClick={this.handleClose}>Cancel</button>
        <button className='btn btn-primary' onClick={this.handleSaveNodeParents}>Save</button>
      </div>
    )
  }
};

export default Parents
