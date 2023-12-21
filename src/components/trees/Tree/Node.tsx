import React from 'react';
import {HierarchyPointNode} from 'd3';

import {TreePersonNode, Person as PersonType} from '../../../common/scripts/types';
import {ConceptionType} from '../../../common/scripts/conceptionTypes';
import {
  NODE_HEIGHT,
  NODE_SMALL_AVATAR_RADIUS,
  PARTNER_PADDING,
  NODE_BUTTON_RADIUS,
  PLUS_BUTTON_PATTERN,
  EDIT_BUTTON_PATTERN,
} from './constants';
import Partner from './Partner';
import Person from './Person';

import styles from './styles.scss';


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
  people: PersonType[],
  readonly?: boolean,
  editNode: (node: HierarchyPointNode<TreePersonNode>) => void,
  addNode: (node: HierarchyPointNode<TreePersonNode>) => void,
}


/**
 * The Node component renders a single node in the tree.
 * @param nodeData The node data to render.
 * @param highlightPeople The people to highlight.
 * @param highlightParents The function to call to highlight the parents of this node.
 * @param showPersonDetails The function to call to show the person details.
 * @param people The people in the tree.
 * @param readonly If true, editing functions are disabled.
 * @param editNode The function to call to edit the node.
 * @param addNode The function to call to add a node.
 */
export default function Node({
  nodeData,
  highlightPeople,
  highlightParents,
  showPersonDetails,
  people,
  readonly,
  editNode,
  addNode,
}: Props) {
  /**
   * Highlight the parents of this node.
   */
  function doHighlightParents() {
    const nodeParentIds: number[] = (nodeData?.data?.parents || []).map((parent: PersonType) => parent._id as number);

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

  /**
   * Get the width of the node.
   * @param node The node to get the width of.
   */
  function getNodeWidth(node: HierarchyPointNode<TreePersonNode>) {
    if (node.data.partners.length > 0) {
      return NODE_HEIGHT * 2;
    }
    // noinspection JSSuspiciousNameCombination
    return NODE_HEIGHT;
  }

  const nodeX = nodePosition(nodeData)[0];
  const nodeY = nodePosition(nodeData)[1];
  const nodeWidth = getNodeWidth(nodeData);

  const personData = people.find((p) => p._id === nodeData?.data?.person?._id);
  const partners = nodeData.data.partners;

  // Check if we need to mute/darken the node person.
  const personId = personData?._id as number;
  const mute = personId && highlightPeople && highlightPeople.length && !highlightPeople.includes(personId);

  return (
    <g className='node' transform={`translate(${nodeX},${nodeY})`}>
      {!readonly && (
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

      {!readonly && (
        <circle
          className={`${styles.addChildIcon} add-node`}
          cx={partners.length ? NODE_HEIGHT : NODE_HEIGHT / 2}
          cy={NODE_HEIGHT}
          fill={`url(#${PLUS_BUTTON_PATTERN})`}
          r={NODE_BUTTON_RADIUS}
          onClick={() => addNode(nodeData)}
        />
      )}

      {!readonly && (
        <circle
          className={`${styles.editNodeIcon} edit-node`}
          cy={NODE_HEIGHT / 2}
          fill={`url(#${EDIT_BUTTON_PATTERN})`}
          r={NODE_BUTTON_RADIUS}
          onClick={() => editNode(nodeData)}
        />
      )}
    </g>
  );
}
