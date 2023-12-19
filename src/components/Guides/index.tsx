import React, {useRef, useEffect} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';

import GuidesHome from './GuidesHome';
import CreateTree from './CreateTree';
import TreeEditor from './TreeEditor';
import CreateAndEditSims from './CreateAndEditSims';
import PlacingSims from './PlacingSims';
import PublishTrees from './PublishTrees';
import LinkSims from './LinkSims';
import NotFound from '../NotFound';


/**
 * Guides page explaining the usage of the Prune Tree App.
 */
export default function Guides() {
  const location = useLocation();
  const myRef = useRef(null);

  useEffect(() => {
    myRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
  }, [location]);

  return (
    <div className='container' ref={myRef}>
      <Routes>
        <Route path='/' element={<GuidesHome />} />
        <Route path='/create-a-tree' element={<CreateTree />} />
        <Route path='/tree-editor' element={<TreeEditor />} />
        <Route path='/create-and-edit-sims' element={<CreateAndEditSims />} />
        <Route path='/placing-sims' element={<PlacingSims />} />
        <Route path='/publising-trees' element={<PublishTrees />} />
        <Route path='/linking-sims-to-other-trees' element={<LinkSims />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </div>
  );
}
