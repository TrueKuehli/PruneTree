import React from 'react'
import linkIcon from '../../../common/images/link.png'
import plusIcon from '../../../common/images/plus.png'
import editIcon from '../../../common/images/edit.png'
import defaultAvatar from '../../../common/images/default-avatar.png'
import {
  NODE_AVATAR_RADIUS,
  NODE_SMALL_AVATAR_RADIUS,
  NODE_BUTTON_RADIUS,
  LINK_BUTTON_PATTERN,
  PLUS_BUTTON_PATTERN,
  EDIT_BUTTON_PATTERN,
  DEFAULT_AVATAR_PATTERN,
  DEFAULT_SMALL_AVATAR_PATTERN
} from './constants'

export default () => {
  return (
    <defs>
      <pattern
        id={LINK_BUTTON_PATTERN}
        width='1'
        height='1'
        x='10'
        y='10'
      >
        <image
          aria-hidden='true'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          xlinkHref={linkIcon}
          x='0'
          y='0'
          width={NODE_BUTTON_RADIUS * 2}
          height={NODE_BUTTON_RADIUS * 2}
          preserveAspectRatio='xMidYMid slice'
        />
      </pattern>
      <pattern
        id={PLUS_BUTTON_PATTERN}
        width='1'
        height='1'
        x='10'
        y='10'
      >
        <image
          aria-hidden='true'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          xlinkHref={plusIcon}
          x='0'
          y='0'
          width={NODE_BUTTON_RADIUS * 2}
          height={NODE_BUTTON_RADIUS * 2}
          preserveAspectRatio='xMidYMid slice'
        />
      </pattern>
      <pattern
        id={EDIT_BUTTON_PATTERN}
        width='1'
        height='1'
        x='10'
        y='10'
      >
        <image
          aria-hidden='true'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          xlinkHref={editIcon}
          x='0'
          y='0'
          width={NODE_BUTTON_RADIUS * 2}
          height={NODE_BUTTON_RADIUS * 2}
          preserveAspectRatio='xMidYMid slice'
        />
      </pattern>
      <pattern
        id={DEFAULT_AVATAR_PATTERN}
        width='1'
        height='1'
        x='10'
        y='10'
      >
        <image
          aria-hidden='true'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          xlinkHref={defaultAvatar}
          x='0'
          y='0'
          width={NODE_AVATAR_RADIUS * 2}
          height={NODE_AVATAR_RADIUS * 2}
          preserveAspectRatio='xMidYMid slice'
        />
      </pattern>
      <pattern
        id={DEFAULT_SMALL_AVATAR_PATTERN}
        width='1'
        height='1'
        x='10'
        y='10'
      >
        <image
          aria-hidden='true'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          xlinkHref={defaultAvatar}
          x='0'
          y='0'
          width={NODE_SMALL_AVATAR_RADIUS * 2}
          height={NODE_SMALL_AVATAR_RADIUS * 2}
          preserveAspectRatio='xMidYMid slice'
        />
      </pattern>
    </defs>
  )
}
