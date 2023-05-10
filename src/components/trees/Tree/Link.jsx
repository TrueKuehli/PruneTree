import React from 'react'
import styles from './styles.scss'
import {
  TREE_DEPTH,
  NODE_HEIGHT,
  NODE_SMALL_AVATAR_RADIUS,
  PARTNER_PADDING
} from './constants'

export default ({ linkData }) => {
  function drawPath () {
    let path = 'M '
    const startX = linkData.parent.x

    // start Y is determined by the number of partners
    const sourcePartnersCount = linkData.parent.data.partners.length
    const partnerSize = (NODE_SMALL_AVATAR_RADIUS * 2) + PARTNER_PADDING
    const totalHeight = sourcePartnersCount * partnerSize
    const heightDiff = (NODE_HEIGHT - totalHeight) / 2
    const offset = (partnerSize / 2) + heightDiff
    const startY = (sourcePartnersCount * partnerSize) + offset + linkData.parent.y

    const sourceHidden = linkData.parent.data.hidden
    if (sourceHidden) {
      // start half way down the depth
      path += startX + ' ' + (linkData.parent.y + (TREE_DEPTH - 25))
    } else {
      // start centered to start node just below the + sign
      path += startX + ' ' + (startY - 30)
    }

    // move down half the depth
    path += ' V ' + (linkData.parent.y + (TREE_DEPTH - 30))

    // move to the target x position
    if (linkData.data.partners.length === 0) {
      // if the target has no partners center to the node
      path += ' H ' + linkData.x
    } else {
      // if the target has partners slightly to the left of the node to
      // get to the node avatar
      path += ' H ' + (linkData.x - 40)
    }

    // // move down to final depth
    path += ' V ' + ((TREE_DEPTH * linkData.depth) + 10)

    return path
  }

  return (
    <path
      className={styles.link}
      d={drawPath()}
    />
  )
}
