import React from 'react'
import { Link } from 'react-router-dom'

export default () => {
  return (
    <div>
      <h1>Guides</h1>
      <p>Creating a Sims family tree using The Plum Tree can be a bit daunting at first so we've created some guides with useful tips to get you started.</p>

      <ul>
        <li><Link to='/guides/create-a-tree'>Create a Tree</Link></li>
        <li><Link to='/guides/tree-editor'>The Tree Editor</Link></li>
        <li><Link to='/guides/create-and-edit-sims'>Adding/Editing Sims</Link></li>
        <li><Link to='/guides/placing-sims'>Placing Sims in Your Tree</Link></li>
        <li><Link to='/guides/publising-trees'>Publish Your Tree</Link></li>
        <li><Link to='/guides/linking-sims-to-other-trees'>Link Sims Across Multiple Trees</Link></li>
      </ul>

      <p>If you can't find what your looking for in the guides try our <Link to='support'>support page</Link> where there's some FAQs and ways you can get in touch with us.</p>
    </div>
  )
}
