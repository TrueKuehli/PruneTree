import React, {ReactElement} from 'react';
import {HierarchyPointNode} from 'd3';
import {v4} from 'uuid';

import {Person as PersonType, TreePersonNode} from '../../../common/scripts/types';
import {
  NODE_AVATAR_RADIUS,
  NODE_SMALL_AVATAR_RADIUS,
  NODE_HEIGHT,
  DEFAULT_AVATAR_PATTERN,
  DEFAULT_SMALL_AVATAR_PATTERN,
} from '../Tree/constants';

import styles from '../Tree/styles.scss';
import {CONCEPTION_TYPES, ConceptionType} from '../../../common/scripts/conceptionTypes';


type Props = {
  personData: PersonType,
  nodeData?: HierarchyPointNode<TreePersonNode>,
  showPersonDetails: (
    personId: number,
    parentType: ConceptionType,
    parentIds: number[],
    adoptiveParentIds: number[],
  ) => void,
  mute: boolean,
  highlightParents?: () => void,
  unhighlightParents?: () => void,
  small?: boolean,
  transform?: string,
}


/**
 * The Person component renders a single person in the tree.
 * @param personData The person data to render.
 * @param nodeData The node data to render.
 * @param showPersonDetails The function to call to show the person details.
 * @param mute If true, opacity of the node is reduced.
 * @param highlightParents The function to call to highlight the parents of this node.
 * @param unhighlightParents The function to call to unhighlight the parents of this node.
 * @param small If true, the node is rendered smaller.
 * @param transform The transform to apply to the person node.
 */
export default function Person({
  personData,
  nodeData,
  showPersonDetails,
  mute,
  highlightParents,
  unhighlightParents,
  small,
  transform,
}: Props) {
  /**
   * Highlight the parents of this node.
   */
  function handleMouseOver() {
    highlightParents && highlightParents();
  }

  /**
   * Unhighlight the parents of this node.
   */
  function handleMouseOut() {
    unhighlightParents && unhighlightParents();
  }

  const avatarRadius = small ? NODE_SMALL_AVATAR_RADIUS : NODE_AVATAR_RADIUS;
  let fillId = small ? DEFAULT_SMALL_AVATAR_PATTERN : DEFAULT_AVATAR_PATTERN;
  const personAvatar = personData?.avatar;
  let image: ReactElement<SVGImageElement> | null = null;

  if (!personData?._id) {
    return null; // No person set
  }

  if (personAvatar) {
    fillId = v4();
    image = (
      <image
        className='avatar-image'
        aria-hidden='true'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        xlinkHref={`./images/${personData.avatar}`}
        x='0'
        y='0'
        width={avatarRadius * 2}
        height={avatarRadius * 2}
        preserveAspectRatio='xMidYMid slice'
      />
    );
  }

  // Extra node data for person details pane (main node person only)
  const parentType = nodeData?.data?.parentType || CONCEPTION_TYPES[0];
  const parents = (nodeData?.data?.parents || []).map((parent: PersonType) => parent?._id as number);
  const adoptiveParents =
    (nodeData?.data?.adoptiveParents || []).map((parent: PersonType) => parent._id as number);

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
        onClick={() => showPersonDetails(personData._id as number, parentType, parents, adoptiveParents)}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      />
    </g>
  );
}
