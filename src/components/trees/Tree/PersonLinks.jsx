import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles.scss'
import {
  NODE_BUTTON_RADIUS,
  NODE_HEIGHT,
  NODE_SMALL_AVATAR_RADIUS,
  NODE_AVATAR_RADIUS,
  LINK_BUTTON_PATTERN
} from './constants'

export default ({ small, links }) => {
  const [linksOpen, setLinksOpen] = useState(false)
  const navigate = useNavigate()

  function handleToggleLinks () {
    setLinksOpen(!linksOpen)
  }

  function goToTree (treeId, personId) {
    navigate({
      pathname: `/public/${treeId}`,
      search: `?p=${personId}`
    })
  }

  // icon position
  const offset = small ? NODE_SMALL_AVATAR_RADIUS : NODE_AVATAR_RADIUS
  const centered = NODE_BUTTON_RADIUS + (NODE_HEIGHT - NODE_BUTTON_RADIUS * 2) / 2

  // list position
  const linkListHeight = links.length * 48
  const listX = centered + offset - NODE_BUTTON_RADIUS
  const listY = centered - offset - NODE_BUTTON_RADIUS - linkListHeight - 10

  return (
    <g className='person-link'>
      <circle
        className={`${styles.linksIcon} person-links`}
        cx={centered + offset}
        cy={centered - offset}
        fill={`url(#${LINK_BUTTON_PATTERN})`}
        r={NODE_BUTTON_RADIUS}
        onClick={handleToggleLinks}
      />

      {linksOpen && (
        <g transform={`translate(${listX},${listY})`}>
          <rect className={styles.linkList} width='198' height={linkListHeight} rx='3' ry='3' />

          {links.map((linkData, index) => {
            const { treeId, personId } = linkData
            return (
              <g
                key={index}
                className={`${styles.linkListItem} person-link`}
                transform={`translate(0,${48 * index})`}
                onClick={() => goToTree(treeId, personId)}
              >
                <rect width='198' height='48' rx='3' ry='3' />
                <text className={styles.linkListText} transform='translate(10,30)'>{linkData.title}</text>
              </g>
            )
          })}
        </g>
      )}
    </g>
  )
}
