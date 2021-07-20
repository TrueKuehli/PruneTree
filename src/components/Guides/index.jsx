import React from 'react'
import { Route, Switch } from 'react-router-dom'

import GuidesHome from './GuidesHome'
import CreateTree from './CreateTree'
import TreeEditor from './TreeEditor'
import CreateAndEditSims from './CreateAndEditSims'
import PlacingSims from './PlacingSims'
import PublishTrees from './PublishTrees'
import LinkSims from './LinkSims'

export default () => {
  return (
    <div className='container'>
      <Switch>
        <Route exact path='/guides' component={GuidesHome} />
        <Route exact path='/guides/create-a-tree' component={CreateTree} />
        <Route exact path='/guides/tree-editor' component={TreeEditor} />
        <Route exact path='/guides/create-and-edit-sims' component={CreateAndEditSims} />
        <Route exact path='/guides/placing-sims' component={PlacingSims} />
        <Route exact path='/guides/publising-trees' component={PublishTrees} />
        <Route exact path='/guides/linking-sims-to-other-trees' component={LinkSims} />
      </Switch>
    </div>
  )
}
