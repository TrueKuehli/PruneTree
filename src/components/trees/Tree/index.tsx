import React, {useState, useEffect, useRef} from 'react';
import {tree as d3Tree, hierarchy} from 'd3-hierarchy';
import {D3ZoomEvent, zoom as d3Zoom} from 'd3-zoom';
import {select} from 'd3-selection';

import {DEFAULTS, Person, Tree as TreeType, TreePersonNode} from '../../../common/scripts/types';
import {CONCEPTION_TYPES, ConceptionType} from '../../../common/scripts/conceptionTypes';
import {TREE_DEPTH, TREE_TOP_PADDING} from './constants';
import Loading from '../../Loading';
import Node from './Node';
import Edge from './Edge';
import CommonPatterns from './CommonPatterns';
import PersonDetails from './PersonDetails';
import TreeDetails from './TreeDetails';

import styles from './styles.scss';
import {HierarchyPointNode} from 'd3';


type Props = {
  tree: TreeType,
  people: Person[],
  loading: boolean,
  readonly?: boolean,
  onChange?: (tree: TreeType, alertSuccess?: boolean) => void,
  onEditNode?: (node: HierarchyPointNode<TreePersonNode>) => void,
}


/**
 * Maintains the previous tree to improve loading performance.
 * @param value The current tree, which overrides the previous tree after returning.
 */
function usePrevious(value: TreeType) {
  const ref = useRef<TreeType>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


/**
 * Main tree component.
 * @param tree The current tree data.
 * @param people The people in the tree.
 * @param loading If true, the tree is loading.
 * @param readonly If true, editing is disabled.
 * @param onChange The function to call when the tree changes.
 * @param onEditNode The function to call when a node is edited.
 */
export default function Tree({tree, people = [], loading, readonly, onChange, onEditNode}: Props) {
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
    useState<ConceptionType>(CONCEPTION_TYPES[0]);
  const [parents, setParents] =
    useState<Person[]>([]);
  const [adoptiveParents, setAdoptiveParents] =
    useState<Person[]>([]);

  const prevTree = usePrevious(tree);

  const svg = useRef<SVGSVGElement>(null);
  const zoom = useRef<SVGGElement>(null);
  const svgElementId = 'prunetree-svg';

  useEffect(() => {
    setZoomInitialized(false);
  }, []);

  useEffect(() => {
    // When moving between trees the component will try and be smart and not remove the Component from the DOM.
    // This makes re-render faster but screws up the zoom handler. So we need to re-init by setting zoomInitialized to
    //   false
    if (tree?._id !== prevTree?._id) {
      setZoomInitialized(false);
    }

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
   * Takes the tree data and generates the links and nodes data followed by setting those in the component state.
   * Called when new props for tree data are received.
   * @param tree The tree data
   */
  function updateTreeState(tree: TreePersonNode) {
    // setup tree data
    const root = hierarchy<TreePersonNode>(tree);

    // declares a tree layout
    const treeMap = d3Tree<TreePersonNode>()
      .nodeSize([200, 80])
      .separation((a, b) => a.parent === b.parent ? 1 : 1.2);
    const treeData = treeMap(root);

    // compute the tree layout nodes and links
    const nodes = treeData.descendants();

    // overwrite the height increase for each node depth/generation
    nodes.forEach(function(d) {
      d.y = d.depth * TREE_DEPTH;
    });

    // get link data (from nodes minus the root node)
    const edges = nodes.slice(1);

    // set state data for our tree to render
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
    const parents = parentIds.map((parentId) =>
      people.find((person) => person._id === parentId));
    const adoptiveParents = adoptiveParentIds.map((parentId) =>
      people.find((person) => person._id === parentId));

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
   * Adds a new node to the tree.
   * @param node The parent node to add the new node under
   */
  function addNode(node: HierarchyPointNode<TreePersonNode>) {
    const newNode: TreePersonNode = {
      ...DEFAULTS.TREE_PERSON_NODE,
    };

    // Create a record of the child indexes in the tree to get to the node we want to add a new node to
    let parentNode = node;
    const childIndexes: number[] = [];
    while (parentNode.parent) {
      // Determine the current nodes index in the parent nodes children
      childIndexes.unshift(parentNode.parent.children.indexOf(parentNode));

      // Move on to next parent node
      parentNode = parentNode.parent;
    }

    // Use the child indexes to add the new node to the tree
    const newTree: TreeType = JSON.parse(JSON.stringify(tree)); // Deep clone of the tree
    let currentNode = newTree.data;
    for (let i = 0; i < childIndexes.length; i++) {
      const index = childIndexes[i];
      currentNode = currentNode.children[index];
    }

    currentNode.children = currentNode.children ? [...currentNode.children, newNode] : [newNode];

    onChange(newTree);
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

  const treeId = (tree?._id || -1) as number;
  const treeTitle = tree?.title || 'Untitled Tree';
  const treeCover = tree?.cover || null;
  const treeDescription = tree?.description || '';

  return (
    loading ? <div className={styles.root}> <Loading message='Loading Tree' /> </div> :

    <div className={styles.root}>
      <div className={styles.showTreeDetails} onClick={handleShowTreeDetails}
           style={onChange ? {top: 65} : {top: 0}}>
        <i className='icon-info' style={{marginRight: 7}} /> Tree Info
      </div>

      {personDetails && (
        <PersonDetails
          style={onChange ? {top: 65} : {top: 0}}
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
          personId={personDetails._id}
          treeId={treeId}
          readonly={readonly}
        />
      )}

      {treeDetailsShown && (
        <TreeDetails
          style={onChange ? {top: 65} : {top: 0}}
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
              // If the node we are rendering is the one where we need to highlight some people (parents)
              //   then pass the array of nodePeopleToHighlight otherwise default to an empty array.
              const highlightPeople = (nodeData === nodeToHighlight) ? nodePeopleToHighlight : [];

              return (
                <Node
                  key={index}
                  nodeData={nodeData}
                  people={people}
                  highlightPeople={highlightPeople}
                  highlightParents={highlightParents}
                  showPersonDetails={showPersonDetails}
                  addNode={addNode}
                  readonly={readonly}
                  editNode={onEditNode}
                />
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
}
