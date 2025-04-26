import React from 'react';
import {HierarchyPointNode} from 'd3';

import {TreePersonNode} from '../../../common/scripts/types';
import {
  TREE_DEPTH,
  NODE_HEIGHT,
  NODE_SMALL_AVATAR_RADIUS,
  PARTNER_PADDING,
} from './constants';

import * as styles from './styles.scss';


type Props = {
  edgeData: HierarchyPointNode<TreePersonNode>
}


/**
 * The Edge component renders a single edge in the tree.
 * @param edgeData The edge data to render, renders edge from the passed node to the parent node.
 */
export default function Edge({edgeData}: Props) {
  /**
   * Draws the path for the edge data.
   */
  function drawPath() {
    let path = 'M ';
    const startX = edgeData.parent.x;

    // start Y is determined by the number of partners
    const sourcePartnersCount = edgeData.parent.data.partners.length;
    const partnerSize = (NODE_SMALL_AVATAR_RADIUS * 2) + PARTNER_PADDING;
    const totalHeight = sourcePartnersCount * partnerSize;
    const heightDiff = (NODE_HEIGHT - totalHeight) / 2;
    const offset = (partnerSize / 2) + heightDiff;
    const startY = (sourcePartnersCount * partnerSize) + offset + edgeData.parent.y;

    // Start centered to start node just below the + sign
    path += startX + ' ' + (startY - 30);

    // Move down half the depth
    path += ' V ' + (edgeData.parent.y + (TREE_DEPTH - 30));

    // Move to the target x position
    if (edgeData.data.partners.length === 0) {
      // If the target has no partners center to the node
      path += ' H ' + edgeData.x;
    } else {
      // If the target has partners slightly to the left of the node to get to the node avatar
      path += ' H ' + (edgeData.x - 40);
    }

    // Move down to final depth
    path += ' V ' + ((TREE_DEPTH * edgeData.depth) + 10);

    return path;
  }

  return (
    <path
      className={styles.link}
      d={drawPath()}
    />
  );
}
