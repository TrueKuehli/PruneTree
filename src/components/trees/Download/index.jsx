import React, { useState, useEffect, useRef } from 'react'
import get from 'lodash.get'

import { tree as d3Tree, hierarchy } from 'd3-hierarchy'
import { zoom as d3Zoom } from 'd3-zoom'
import { select } from 'd3-selection'

import { TREE_DEPTH, TREE_TOP_PADDING } from '../Tree/constants'
import Node from './Node'
import Link from '../Tree/Link'
import PersonDetails from './PersonDetails'
import TreeDetails from './TreeDetails'
import CommonPatterns from '../Tree/CommonPatterns'
import styles from '../Tree/styles.scss'

export default ({ tree, people = [], readonly, onChange, onEditNode }) => {
  const [zoomInitialized, setZoomInitialized] = useState(false)
  const [links, setLinks] = useState([])
  const [nodes, setNodes] = useState([])
  const [nodeToHighlight, setNodeToHighlight] = useState(null)
  const [nodePeopleToHighlight, setNodePeopleToHighlight] = useState([])
  const [personDetails, setPersonDetails] = useState(null)
  const [treeDetails, setTreeDetails] = useState(null)
  const [parentType, setParentType] = useState('NONE')
  const [parents, setParents] = useState([])
  const [adoptiveParents, setAdoptiveParents] = useState([])

  const svg = useRef(null)
  const zoom = useRef(null)
  const svgElementId = 'prunetree-svg'

  useEffect(() => {
    setZoomInitialized(false)
  }, [])

  useEffect(() => {
    if (tree && tree.data) {
      updateTreeState(tree.data)
    }
  }, [tree])

  useEffect(() => {
    if (svg.current && !zoomInitialized) {
      initSVGZoom(svg.current)
    }
  }, [zoomInitialized, svg.current])

  /**
   * Takes the tree data and generates the links and nodes data followed by
   * setting those in the component state. Called when new props for tree data
   * are received.
   * @param  {Object} tree The tree data
   * @return {void}
   */
  function updateTreeState (tree) {
    // setup tree data
    const root = hierarchy(tree)

    // declares a tree layout
    const treeMap = d3Tree().nodeSize([200, 80]).separation((a, b) => a.parent === b.parent ? 1 : 1.2)
    const treeData = treeMap(root)

    // compute the tree layout nodes and links
    const nodes = treeData.descendants()

    // overwrite the height increase for each node depth/generation
    nodes.forEach(function (d) {
      d.y = d.depth * TREE_DEPTH
    })

    // get link data (from nodes minus the root node)
    const links = nodes.slice(1)

    // set state data for our tree to render
    setNodes(nodes)
    setLinks(links)
  }

  function initSVGZoom (svg) {
    // have to check both clientWidth and parentNode.clientWidth to fix FireFox
    // issue where clientWidth is 0
    const width = svg.clientWidth || svg.parentNode.clientWidth

    const zoomInstance = d3Zoom()
      .scaleExtent([0.1, 3])
      .on('zoom', zoomed)

    const selectionSvg = select(`svg#${svgElementId}`)
      .call(zoomInstance)

    // move to initial position
    zoomInstance.translateBy(selectionSvg, width / 2, TREE_TOP_PADDING)

    setZoomInitialized(true)
  }

  function zoomed (event) {
    const zoomTransform = event.transform
    zoom.current.setAttribute('transform', `translate(${zoomTransform.x},${zoomTransform.y})scale(${zoomTransform.k})`)
  }

  function showPersonDetails (personId, parentType = 'NONE', parentIds = [], adoptiveParentIds = []) {
    const personDetails = people.find(p => p._id === personId)
    const parents = parentIds.map(parentId => people.find(person => person._id === parentId))
    const adoptiveParents = adoptiveParentIds.map(parentId => people.find(person => person._id === parentId))

    setPersonDetails(personDetails)
    setParentType(parentType)
    setParents(parents)
    setAdoptiveParents(adoptiveParents)
  }

  function handleShowTreeDetails () {
    setTreeDetails(true)
  }

  function closePersonDetails () {
    setPersonDetails(null)
  }

  function closeTreeDetails () {
    setTreeDetails(false)
  }

  function highlightParents (node, peopleIds) {
    setNodeToHighlight(node)
    setNodePeopleToHighlight(peopleIds)
  }

  const treeId = get(tree, '_id', '')
  const treeTitle = get(tree, 'title', 'Untitled Tree')
  const treeCover = get(tree, 'cover')
  const treeDescription = get(tree, 'description', '')

  return (
    <div className={styles.root}>
      <div
        className={styles.showTreeDetails}
        onClick={handleShowTreeDetails}
        style={onChange ? { top: 65 } : { top: 0 }}
      >
        <i className='icon-info' style={{ marginRight: 7 }} /> Tree Info
      </div>

      {personDetails && (
        <PersonDetails
          style={onChange ? { top: 65 } : { top: 0 }}
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
        />
      )}

      {treeDetails && (
        <TreeDetails
          style={onChange ? { top: 65 } : { top: 0 }}
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
            {links.map((linkData, index) => (
              <Link
                key={index}
                linkData={linkData}
              />
            ))}

            {nodes.map((nodeData, index) => {
              // if the node we are rendering is the one where we need to
              // highlight some people (parents) then pass the array of
              // nodePeopleToHighlight otherwise default to an empty array.
              let highlightPeople = []
              if (nodeData === nodeToHighlight) {
                highlightPeople = nodePeopleToHighlight
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
              )
            })}
          </g>
        </g>
      </svg>
    </div>
  )
}
