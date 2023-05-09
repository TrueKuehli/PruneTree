import React, { useRef, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import GuidesHome from './GuidesHome'
import CreateTree from './CreateTree'
import TreeEditor from './TreeEditor'
import CreateAndEditSims from './CreateAndEditSims'
import PlacingSims from './PlacingSims'
import PublishTrees from './PublishTrees'
import LinkSims from './LinkSims'
import NotFound from '../NotFound'

export default () => {
  const location = useLocation()
  const myRef = useRef(null)

  useEffect(() => {
    myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location])

  return (
    <div className='container' ref={myRef}>
      <Routes>
        <Route exact path='/' element={<GuidesHome />} />
        <Route exact path='/create-a-tree' element={<CreateTree />} />
        <Route exact path='/tree-editor' element={<TreeEditor />} />
        <Route exact path='/create-and-edit-sims' element={<CreateAndEditSims />} />
        <Route exact path='/placing-sims' element={<PlacingSims />} />
        <Route exact path='/publising-trees' element={<PublishTrees />} />
        <Route exact path='/linking-sims-to-other-trees' element={<LinkSims />} />
        <Route exact path='/*' element={<NotFound />} />
      </Routes>
    </div>
  )
}
