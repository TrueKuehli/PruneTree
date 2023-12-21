import React, {useState, useEffect, useRef} from 'react';
import {tree as d3Tree, hierarchy} from 'd3-hierarchy';
import {zoom as d3Zoom, D3ZoomEvent} from 'd3-zoom';
import {select} from 'd3-selection';
import {HierarchyPointNode} from 'd3';

import {Person, Tree, TreePersonNode} from '../../../common/scripts/types';
import {TREE_DEPTH, TREE_TOP_PADDING} from '../Tree/constants';
import Node from './Node';
import TreeDetails from './TreeDetails';
import CommonPatterns from '../Tree/CommonPatterns';
import Edge from '../Tree/Edge';
import PersonDetails from './PersonDetails';

import styles from '../Tree/styles.scss';
import {ConceptionType} from '../../../common/scripts/conceptionTypes';


type Props = {
  tree: Tree,
  people: Person[],
}


/**
 * The Tree Viewer component as seen in the local download of a tree.
 * @param
 */
export default function Download({tree, people = []}: Props) {
  const [zoomInitialized, setZoomInitialized] = useState(false);
  const [edges, setEdges] =
    useState<HierarchyPointNode<TreePersonNode>[]>([]);
  const [nodes, setNodes] =
    useState<HierarchyPointNode<TreePersonNode>[]>([]);
  const [nodeToHighlight, setNodeToHighlight] =
    useState<HierarchyPointNode<TreePersonNode>>(null);
  const [nodePeopleToHighlight, setNodePeopleToHighlight] =
    useState<number[]>([]);
  const [personDetails, setPersonDetails] = useState<Person>(null);
  const [treeDetailsShown, setTreeDetailsShown] = useState(false);
  const [parentType, setParentType] =
    useState<ConceptionType>('WooHoo');
  const [parents, setParents] = useState<Person[]>([]);
  const [adoptiveParents, setAdoptiveParents] = useState<Person[]>([]);

  const svg = useRef<SVGSVGElement>(null);
  const zoom = useRef<SVGGElement>(null);
  const svgElementId = 'prunetree-svg';

  useEffect(() => {
    setZoomInitialized(false);
  }, []);

  useEffect(() => {
    if (tree && tree.data) {
      updateTreeState(tree.data);
    }
  }, [tree]);

  useEffect(() => {
    if (svg.current && !zoomInitialized) {
      initSVGZoom(svg.current);
    }
  }, [zoomInitialized, svg.current]);

  /**
   * Takes the tree data and generates the edges and node data followed by setting those in the component state.
   *   Called when new props for tree data are received.
   * @param tree The tree root node data.
   */
  function updateTreeState(tree: TreePersonNode) {
    // Set up tree data
    const root = hierarchy<TreePersonNode>(tree);

    // Declare the tree layout
    const treeMap = d3Tree<TreePersonNode>()
      .nodeSize([200, 80])
      .separation((a, b) => a.parent === b.parent ? 1 : 1.2);
    const treeData = treeMap(root);

    // Compute the tree layout nodes and edges
    const nodes = treeData.descendants();

    // Overwrite the height increase for each node depth/generation
    nodes.forEach((d) => {
      d.y = d.depth * TREE_DEPTH;
    });

    // Get edge data (from nodes minus the root node)
    const edges = nodes.slice(1);

    // Set state data for our tree to render
    setNodes(nodes);
    setEdges(edges);
  }

  /**
   * Initializes the zoom functionality for the SVG element.
   * @param svg The SVG element to initialize zoom on.
   */
  function initSVGZoom(svg: SVGSVGElement) {
    // @ts-expect-error Have to check both clientWidth and parentNode.clientWidth to fix Firefox
    //   issue where clientWidth is 0
    const width = svg.clientWidth || svg.parentNode.clientWidth;

    const zoomInstance = d3Zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', zoomed);

    const selectionSvg = select<SVGSVGElement, unknown>(`svg#${svgElementId}`)
      .call(zoomInstance);

    // Move to initial position
    zoomInstance.translateBy(selectionSvg, width / 2, TREE_TOP_PADDING);

    setZoomInitialized(true);
  }

  /**
   * Handles the zoom event on the SVG element.
   * @param event The zoom event.
   */
  function zoomed(event: D3ZoomEvent<SVGSVGElement, unknown>) {
    const zoomTransform = event.transform;
    zoom.current.setAttribute(
      'transform',
      `translate(${zoomTransform.x},${zoomTransform.y})scale(${zoomTransform.k})`,
    );
  }

  /**
   * Shows the person details modal after setting the person details and parent data.
   * @param personId The ID of the person to show details for.
   * @param parentType The type of parent (WooHoo, Adoptive, etc.)
   * @param parentIds The IDs of the parents.
   * @param adoptiveParentIds The IDs of the adoptive parents.
   */
  function showPersonDetails(
    personId: number,
    parentType: ConceptionType = 'WooHoo',
    parentIds: number[] = [],
    adoptiveParentIds: number[] = [],
  ) {
    const personDetails = people.find((p) => p._id === personId);
    const parents = parentIds.map(
      (parentId) => people.find((person) => person._id === parentId),
    );
    const adoptiveParents = adoptiveParentIds.map(
      (parentId) => people.find((person) => person._id === parentId),
    );

    setPersonDetails(personDetails);
    setParentType(parentType);
    setParents(parents);
    setAdoptiveParents(adoptiveParents);
  }

  /**
   * Shows the tree details modal.
   */
  function handleShowTreeDetails() {
    setTreeDetailsShown(true);
  }

  /**
   * Closes the person details modal.
   */
  function closePersonDetails() {
    setPersonDetails(null);
  }

  /**
   * Closes the tree details modal.
   */
  function closeTreeDetails() {
    setTreeDetailsShown(false);
  }

  /**
   * Highlights the parents of the given node.
   * @param node The node to highlight the parents of.
   * @param peopleIds The IDs of the parents to highlight.
   */
  function highlightParents(node: HierarchyPointNode<TreePersonNode>, peopleIds: number[]) {
    setNodeToHighlight(node);
    setNodePeopleToHighlight(peopleIds);
  }

  const treeTitle = tree?.title || 'Untitled Tree';
  const treeCover = tree?.cover || null;
  const treeDescription = tree?.description || '';

  return (
    <div className={styles.root}>
      <div
        className={styles.showTreeDetails}
        onClick={handleShowTreeDetails}
        style={{top: 0}}
      >
        <i className='icon-info' style={{marginRight: 7}} /> Tree Info
      </div>

      {personDetails && (
        <PersonDetails
          style={{top: 0}}
          closeDetails={closePersonDetails}
          avatar={personDetails.avatar}
          firstName={personDetails.firstName}
          lastName={personDetails.lastName}
          bio={personDetails.bio}
          traits={personDetails.traits}
          aspirations={personDetails.aspirations}
          lifeStates={personDetails.lifeStates}
          parentType={parentType}
          parents={parents}
          adoptiveParents={adoptiveParents}
          custom={personDetails.custom}
        />
      )}

      {treeDetailsShown && (
        <TreeDetails
          style={{top: 0}}
          closeDetails={closeTreeDetails}
          image={treeCover}
          title={treeTitle}
          description={treeDescription}
        />
      )}

      <svg width='100%' height='100%' ref={svg} id={svgElementId}>
        <CommonPatterns />

        <g ref={zoom}>
          <g className='transform-layer'>
            {edges.map((edgeData, index) => (
              <Edge
                key={index}
                edgeData={edgeData}
              />
            ))}

            {nodes.map((nodeData, index) => {
              // if the node we are rendering is the one where we need to
              // highlight some people (parents) then pass the array of
              // nodePeopleToHighlight otherwise default to an empty array.
              let highlightPeople: number[] = [];
              if (nodeData === nodeToHighlight) {
                highlightPeople = nodePeopleToHighlight;
              }

              return (
                <Node
                  key={index}
                  nodeData={nodeData}
                  people={people}
                  highlightPeople={highlightPeople}
                  highlightParents={highlightParents}
                  showPersonDetails={showPersonDetails}
                />
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
}
