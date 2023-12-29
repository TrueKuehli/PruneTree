import React, {useRef, useEffect} from 'react';
import {useLocation} from 'react-router-dom';

import GuideRoutes from './GuideRoutes';
import GuidePage from './GuidePage';

// Markdown files
import Home from './content/Home.md';
import Changes from './content/Changes.md';
import Storage from './content/Storage.md';
import CreateTree from './content/CreateTree.md';
import TreeEditor from './content/TreeEditor.md';
import CreateAndEditSims from './content/CreateAndEditSims.md';
import PlacingSims from './content/PlacingSims.md';
import LinkSims from './content/LinkSims.md';

// Assets
import storagePersistence from './assets/storage-persistence.png';
import storageUsage from './assets/storage-usage.png';
import createTree from './assets/create-tree.gif';
import editTree from './assets/edit-tree.gif';
import treeNode from './assets/tree-node.png';
import toolbarGif from './assets/tree-editor-toolbar.gif';
import customTrait from './assets/custom-trait.gif';
import simInfoPanel from './assets/sim-info-panel.gif';
import setNodePerson from './assets/set-node-person.gif';
import addPartner from './assets/add-partner.gif';
import parents from './assets/parents.gif';
import linkDetails from './assets/link-details.gif';
import addLink from './assets/add-link.gif';


/**
 * Guides page explaining the usage of the Prune Tree App.
 */
export default function Guides() {
  const location = useLocation();
  const containerRef = useRef(null);

  useEffect(() => {
    containerRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
  }, [location]);

  return (
    <div className='container' ref={containerRef}>
      <GuideRoutes homeMarkdown={Home}>
        <GuidePage
          title={'Changes from the Prune Tree App'}
          path={'changes'}
          markdown={Changes}
        />
        <GuidePage
          title={'Browser Storage'}
          path={'storage'}
          markdown={Storage}
          resources={{storagePersistence, storageUsage}}
        />
        <GuidePage
          title={'Create a Tree'}
          path={'create-a-tree'}
          markdown={CreateTree}
          resources={{createTree, editTree}}
        />
        <GuidePage
          title={'The Tree Editor'}
          path={'tree-editor'}
          markdown={TreeEditor}
          resources={{treeNode, toolbarGif}}
        />
        <GuidePage
          title={'Adding/Editing Sims'}
          path={'create-and-edit-sims'}
          markdown={CreateAndEditSims}
          resources={{simInfoPanel, customTrait}}
        />
        <GuidePage
          title={'Placing Sims in Your Tree'}
          path={'placing-sims'}
          markdown={PlacingSims}
          resources={{setNodePerson, addPartner, parents}}
        />
        <GuidePage
          title={'Link Sims Across Multiple Trees'}
          path={'linking-sims-to-other-trees'}
          markdown={LinkSims}
          resources={{linkDetails, addLink}}
        />
      </GuideRoutes>
    </div>
  );
}
