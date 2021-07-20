import React, { Component } from 'react'

import Person from './Person'
import Partners from './Partners'
import Parents from './Parents'

import styles from './styles.scss'

class NodeEdit extends Component {
  constructor (props) {
    super(props)

    const node = Object.assign({}, this.props.node.data)

    this.state = {
      node,
      currentView: null
    }

    this.handleSave = this.handleSave.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleClose = props.close
  }

  setView (currentView) {
    this.setState({
      currentView
    })
  }

  handleSave (newNodeData) {
    const node = Object.assign(this.props.node.data, newNodeData)
    this.props.saveTree()

    this.setState({
      node
    })
  }

  handleDelete () {
    const confirmDelete = confirm('Are you sure you want to delete this node?')

    if (confirmDelete) {
      const node = this.props.node
      const parent = node.parent
      const index = parent.children.indexOf(node)

      parent.data.children.splice(index, 1)

      this.props.saveTree()
      this.props.close()
    }
  }

  render () {
    const { node, currentView } = this.state
    const people = this.props.people

    return (
      <div className={styles.editNodeContainer}>
        <div className='container'>
          <div className={styles.closeButton} onClick={this.handleClose}>
            <span>Close</span>
            <i className={styles.close} />
          </div>

          <h1>Edit Node</h1>
          <p>Edit a point in a tree by adding a person to a node and their partners.</p>

          {currentView === 'person' && (
            <Person
              node={node}
              people={people}
              onSave={this.handleSave}
              close={() => this.setView(null)}
            />
          )}

          {currentView === 'partners' && (
            <Partners
              node={node}
              people={people}
              onSave={this.handleSave}
              close={() => this.setView(null)}
            />
          )}

          {currentView === 'parents' && (
            <Parents
              node={node}
              people={people}
              onSave={this.handleSave}
              close={() => this.setView(null)}
            />
          )}

          {currentView === null && (
            <div>
              <div className={styles.editNodeSection}>
                <h2>Set Node Person</h2>
                <p>A node person is the Sim you'll see on the left at each point in the tree with their parents above, partners to the right and children below.</p>
                <button className='btn btn-primary' onClick={() => this.setView('person')}>Set This Nodes Person <i className='icon-chevron-right' /></button>
              </div>

              <div className={styles.editNodeSection}>
                <h2>Set Node Partners</h2>
                <p>A Sim can have multiple partners current or past.</p>
                <button className='btn btn-primary' onClick={() => this.setView('partners')}>Set This Nodes Partners <i className='icon-chevron-right' /></button>
              </div>

              <div className={styles.editNodeSection}>
                <h2>Set Node Parents</h2>
                <p>Add extra information on how your Sim came to be and who raised them.</p>
                <button className='btn btn-primary' onClick={() => this.setView('parents')}>Set This Nodes Parent Details <i className='icon-chevron-right' /></button>
              </div>

              <div className={styles.editNodeSection}>
                <h2>Danger Zone</h2>
                <p>Delete this node? Remember if you delete this node you will also delete any children attached to it too.</p>
                <button className='btn btn-danger' onClick={this.handleDelete}>Delete This Node</button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
};

export default NodeEdit
