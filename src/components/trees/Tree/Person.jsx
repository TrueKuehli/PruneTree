import React from 'react'
import { v4 } from 'uuid'
import PersonLinks from './PersonLinks'
import styles from './styles.scss'
import get from 'lodash.get'
import {
  NODE_AVATAR_RADIUS,
  NODE_SMALL_AVATAR_RADIUS,
  NODE_HEIGHT,
  DEFAULT_AVATAR_PATTERN,
  DEFAULT_SMALL_AVATAR_PATTERN
} from './constants'
import { getUploadedImageUri } from '../../../common/js/utils'

const Person = (props) => {
  const {
    small,
    personData,
    nodeData,
    transform,
    mute,
    highlightParents,
    unhighlightParents
  } = props

  function handleMouseOver () {
    highlightParents && highlightParents()
  }

  function handleMouseOut () {
    unhighlightParents && unhighlightParents()
  }

  const avatarRadius = small ? NODE_SMALL_AVATAR_RADIUS : NODE_AVATAR_RADIUS
  let fillId = small ? DEFAULT_SMALL_AVATAR_PATTERN : DEFAULT_AVATAR_PATTERN
  const personAvatar = get(personData, 'avatar', false)
  let image, links

  if (!get(personData, '_id', false)) {
    return null // no person set
  }

  if (personAvatar) {
    fillId = v4()
    image = (
      <image
        className='avatar-image'
        aria-hidden='true'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        xlinkHref={getUploadedImageUri(personData.avatar, '200x200')}
        x='0'
        y='0'
        width={avatarRadius * 2}
        height={avatarRadius * 2}
        preserveAspectRatio='xMidYMid slice'
      />
    )
  }

  if (get(personData, 'links.length')) {
    links = (
      <PersonLinks
        links={personData.links}
        small={small}
      />
    )
  }

  // extra node data for person details pane (main node person only)
  const parentType = get(nodeData, 'data.parentType', 'NONE')
  const parents = get(nodeData, 'data.parents', []).map(parent => get(parent, '_id'))
  const adoptiveParents = get(nodeData, 'data.adoptiveParents', []).map(parent => get(parent, '_id'))

  return (
    <g className='person' transform={transform}>
      {personAvatar && (
        <defs>
          <pattern
            className='avatar-pattern'
            id={fillId}
            width='1'
            height='1'
            x='10'
            y='10'
          >
            {image}
          </pattern>
        </defs>
      )}
      <circle
        className={styles.avatar}
        opacity={mute ? '0.5' : '1'}
        r={avatarRadius}
        cx={avatarRadius + (NODE_HEIGHT - avatarRadius * 2) / 2}
        cy={avatarRadius + (NODE_HEIGHT - avatarRadius * 2) / 2}
        fill={`url(#${fillId})`}
        onClick={() => props.showPersonDetails(personData._id, parentType, parents, adoptiveParents)}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      />
      {links}
    </g>
  )
}

export default Person
