import React, { Component } from 'react'
import get from 'lodash.get'
import styles from './styles.scss'

import Partner from './Partner'
import Person from './Person'

import {
  NODE_HEIGHT,
  NODE_SMALL_AVATAR_RADIUS,
  PARTNER_PADDING,
  NODE_BUTTON_RADIUS,
  PLUS_BUTTON_PATTERN,
  EDIT_BUTTON_PATTERN
} from './constants'

class Node extends Component {
  constructor (props) {
    super(props)

    this.highlightParents = this.highlightParents.bind(this)
    this.unhighlightParents = this.unhighlightParents.bind(this)
  }

  highlightParents () {
    const { nodeData, highlightParents } = this.props
    const nodeParentIds = get(nodeData, 'data.parents', []).map((parent) => parent._id)

    if (get(nodeData, 'parent') && highlightParents) {
      highlightParents(nodeData.parent, nodeParentIds)
    }
  }

  unhighlightParents () {
    const { nodeData, highlightParents } = this.props

    if (get(nodeData, 'parent') && highlightParents) {
      highlightParents(nodeData.parent, [])
    }
  }

  nodePosition (node) {
    let left = NODE_HEIGHT / 2

    if (node.data.partners.length > 0) {
      left = NODE_HEIGHT
    }

    return [node.x - left, node.y]
  }

  partnerPosition (index, partnerCount) {
    const partnerSize = (NODE_SMALL_AVATAR_RADIUS * 2) + PARTNER_PADDING
    const totalHeight = partnerCount * partnerSize
    const heightDiff = (NODE_HEIGHT - totalHeight) / 2
    const offset = (partnerSize / 2) + heightDiff

    const y = ((index * partnerSize) + offset) - 40

    return [80, y]
  }

  nodeWidth (node) {
    if (node.data.partners.length > 0) {
      return NODE_HEIGHT * 2
    }
    return NODE_HEIGHT
  }

  render () {
    const node = this.props.nodeData

    const nodeX = this.nodePosition(node)[0]
    const nodeY = this.nodePosition(node)[1]
    const nodeWidth = this.nodeWidth(node)

    const personData = this.props.people.find(p => p._id === get(node, 'data.person._id'))
    const partners = node.data.partners

    // check if we need to mute/darken the node person.
    const personId = get(personData, '_id')
    const highlightPeople = get(this.props, 'highlightPeople', [])
    const mute = personId && highlightPeople.length && !highlightPeople.includes(personId)

    return (
      <g className='node' transform={`translate(${nodeX},${nodeY})`}>
        {!this.props.readonly && (
          <rect
            height={NODE_HEIGHT}
            width={nodeWidth}
            rx={NODE_HEIGHT / 2}
            ry={NODE_HEIGHT / 2}
            className={styles.background}
          />
        )}

        <Person
          personData={personData}
          nodeData={node}
          showPersonDetails={this.props.showPersonDetails}
          mute={mute}
          highlightParents={this.highlightParents}
          unhighlightParents={this.unhighlightParents}
        />

        {partners.map((partnerData, index, partners) => {
          const partnerPosition = this.partnerPosition(index, partners.length)

          return (
            <Partner
              key={index}
              partnerData={partnerData}
              partners={partners}
              people={this.props.people}
              transform={`translate(${partnerPosition[0]},${partnerPosition[1]})`}
              showPersonDetails={this.props.showPersonDetails}
              highlightPeople={highlightPeople}
            />
          )
        })}

        {!this.props.readonly && (
          <circle
            className={`${styles.addChildIcon} add-node`}
            cx={partners.length ? NODE_HEIGHT : NODE_HEIGHT / 2}
            cy={NODE_HEIGHT}
            fill={`url(#${PLUS_BUTTON_PATTERN})`}
            r={NODE_BUTTON_RADIUS}
            onClick={() => this.props.addNode(node)}
          />
        )}

        {!this.props.readonly && (
          <circle
            className={`${styles.editNodeIcon} edit-node`}
            cy={NODE_HEIGHT / 2}
            fill={`url(#${EDIT_BUTTON_PATTERN})`}
            r={NODE_BUTTON_RADIUS}
            onClick={() => this.props.editNode(node)}
          />
        )}
      </g>
    )
  }
};

export default Node
