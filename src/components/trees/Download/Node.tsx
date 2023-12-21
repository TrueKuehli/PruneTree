import React from 'react';
import {HierarchyPointNode} from 'd3';

import {ConceptionType} from '../../../common/scripts/conceptionTypes';
import {Person, TreePersonNode} from '../../../common/scripts/types';
import Partner from './Partner';
import PersonComponent from './Person';
import {
  NODE_HEIGHT,
  NODE_SMALL_AVATAR_RADIUS,
  PARTNER_PADDING,
} from '../Tree/constants';

type Props = {
  nodeData: HierarchyPointNode<TreePersonNode>,
  highlightPeople: number[],
  highlightParents: (node: HierarchyPointNode<TreePersonNode>, peopleIds: number[]) => void,
  showPersonDetails: (
    personId: number,
    parentType: ConceptionType,
    parentIds: number[],
    adoptiveParentIds: number[],
  ) => void,
  people: Person[],
}


/**
 * The Node component renders a single node in the tree.
 * @param nodeData The node data to render.
 * @param highlightPeople The people to highlight.
 * @param highlightParents The function to call to highlight the parents of this node.
 * @param showPersonDetails The function to call to show the person details.
 * @param people The people in the tree.
 */
export default function Node({
  nodeData,
  highlightPeople,
  highlightParents,
  showPersonDetails,
  people,
}: Props) {
  /**
   * Highlight the parents of this node.
   */
  function doHighlightParents() {
    const nodeParentIds: number[] = (nodeData?.data?.parents || []).map((parent: Person) => parent._id as number);

    if (nodeData?.parent && highlightParents) {
      highlightParents(nodeData.parent, nodeParentIds);
    }
  }

  /**
   * Unhighlight the parents of this node.
   */
  function doUnhighlightParents() {
    if (nodeData?.parent && highlightParents) {
      highlightParents(nodeData.parent, []);
    }
  }

  /**
   * Get the position of the node.
   * @param node The node to get the position of.
   */
  function nodePosition(node: HierarchyPointNode<TreePersonNode>): [number, number] {
    let left = NODE_HEIGHT / 2;

    if (node.data.partners.length > 0) {
      // noinspection JSSuspiciousNameCombination
      left = NODE_HEIGHT;
    }

    return [node.x - left, node.y];
  }

  /**
   * Get the position of a partner of the current person.
   * @param index The index of the partner.
   * @param partnerCount The total number of partners.
   */
  function getPartnerPosition(index: number, partnerCount: number): [number, number] {
    const partnerSize = (NODE_SMALL_AVATAR_RADIUS * 2) + PARTNER_PADDING;
    const totalHeight = partnerCount * partnerSize;
    const heightDiff = (NODE_HEIGHT - totalHeight) / 2;
    const offset = (partnerSize / 2) + heightDiff;

    const y = ((index * partnerSize) + offset) - 40;

    return [80, y];
  }

  const nodeX = nodePosition(nodeData)[0];
  const nodeY = nodePosition(nodeData)[1];

  const personData = people.find((p) => p._id === nodeData?.data?.person?._id);
  const partners = nodeData.data.partners;

  // Check if we need to mute/darken the node person.
  const personId = personData?._id as number;
  const mute = personId && highlightPeople && highlightPeople.length && !highlightPeople.includes(personId);

  return (
    <g className='node' transform={`translate(${nodeX},${nodeY})`}>
      <PersonComponent
        personData={personData}
        nodeData={nodeData}
        showPersonDetails={showPersonDetails}
        mute={mute}
        highlightParents={doHighlightParents}
        unhighlightParents={doUnhighlightParents}
      />

      {partners.map((partnerData, index, partners) => {
        const partnerPosition = getPartnerPosition(index, partners.length);

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
        );
      })}
    </g>
  );
}
