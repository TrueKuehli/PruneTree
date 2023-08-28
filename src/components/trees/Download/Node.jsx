import React from 'react'
import get from 'lodash.get'
import Partner from './Partner'
import Person from './Person'

import {
  NODE_HEIGHT,
  NODE_SMALL_AVATAR_RADIUS,
  PARTNER_PADDING
} from '../Tree/constants'

export default ({
  nodeData,
  highlightPeople,
  highlightParents,
  showPersonDetails,
  people
}) => {
  function doHighlightParents () {
    const nodeParentIds = get(nodeData, 'data.parents', []).map((parent) => parent._id)

    if (get(nodeData, 'parent') && highlightParents) {
      highlightParents(nodeData.parent, nodeParentIds)
    }
  }

  function doUnhighlightParents () {
    if (get(nodeData, 'parent') && highlightParents) {
      highlightParents(nodeData.parent, [])
    }
  }

  function nodePosition (node) {
    let left = NODE_HEIGHT / 2

    if (node.data.partners.length > 0) {
      left = NODE_HEIGHT
    }

    return [node.x - left, node.y]
  }

  function getPartnerPosition (index, partnerCount) {
    const partnerSize = (NODE_SMALL_AVATAR_RADIUS * 2) + PARTNER_PADDING
    const totalHeight = partnerCount * partnerSize
    const heightDiff = (NODE_HEIGHT - totalHeight) / 2
    const offset = (partnerSize / 2) + heightDiff

    const y = ((index * partnerSize) + offset) - 40

    return [80, y]
  }

  const nodeX = nodePosition(nodeData)[0]
  const nodeY = nodePosition(nodeData)[1]

  const personData = people.find(p => p._id === get(nodeData, 'data.person._id'))
  const partners = nodeData.data.partners

  // check if we need to mute/darken the node person.
  const personId = get(personData, '_id')
  const mute = personId && highlightPeople && highlightPeople.length && !highlightPeople.includes(personId)

  return (
    <g className='node' transform={`translate(${nodeX},${nodeY})`}>
      <Person
        personData={personData}
        nodeData={nodeData}
        showPersonDetails={showPersonDetails}
        mute={mute}
        highlightParents={doHighlightParents}
        unhighlightParents={doUnhighlightParents}
      />

      {partners.map((partnerData, index, partners) => {
        const partnerPosition = getPartnerPosition(index, partners.length)

        return (
          <Partner
            key={index}
            partnerData={partnerData}
            partners={partners}
            people={people}
            transform={`translate(${partnerPosition[0]},${partnerPosition[1]})`}
            showPersonDetails={showPersonDetails}
            highlightPeople={highlightPeople}
          />
        )
      })}
    </g>
  )
}
