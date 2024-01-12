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
import Download from './content/Download.md';
import LinkSims from './content/LinkSims.md';


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
        />
        <GuidePage
          title={'Create a Tree'}
          path={'create-a-tree'}
          markdown={CreateTree}
        />
        <GuidePage
          title={'The Tree Editor'}
          path={'tree-editor'}
          markdown={TreeEditor}
        />
        <GuidePage
          title={'Adding/Editing Sims'}
          path={'create-and-edit-sims'}
          markdown={CreateAndEditSims}
        />
        <GuidePage
          title={'Placing Sims in Your Tree'}
          path={'placing-sims'}
          markdown={PlacingSims}
        />
        <GuidePage
          title={'Downloading Your Tree'}
          path={'download-and-backup'}
          markdown={Download}
        />
        <GuidePage
          title={'Link Sims Across Multiple Trees'}
          path={'linking-sims-to-other-trees'}
          markdown={LinkSims}
        />
      </GuideRoutes>
    </div>
  );
}
