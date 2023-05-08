import React from 'react'
import GuideIndexLink from '../GuideIndexLink'
import GuideNavLinks from '../GuideNavLinks'
import toolbarGif from './tree-editor-toolbar.gif'
import treeNode from './tree-node.png'

export default () => {
  return (
    <div>
      <GuideIndexLink />
      <h1>The Tree Editor</h1>
      <p>Once you've created your tree before you dive in make sure you're familiar with the tree editor. Get to know it, take it out for dinner, live a long and happy life together or something along those lines.</p>
      <h2>The Tree Editor Toolbar</h2>
      <img src={toolbarGif} width='100%' />
      <p>The tree editor toolbar lets you get to many areas when it comes to editing your tree.</p>
      <h3>Actions - Save Tree</h3>
      <p>Under <strong>Actions</strong> you can save your tree. The plum tree auto saves as you modify your tree but this lets you be certain everything is saved. A success message will appear to confirm the save.</p>
      <h3>Actions - Publish Tree</h3>
      <p>Under <strong>Actions</strong> when you click <strong>Publish Tree</strong> you'll be given the options to make your tree public and if you want it listed in the gallery.</p>
      <p>We go into more details of this in the guide Publish Your Tree.</p>
      <h3>Actions - Delete Tree</h3>
      <p>If you no longer want a tree you can delete it. You'll be asked to confirm if you want to delete a tree incase you click this option accidently.</p>
      <p>If a tree is public or in the gallery these copies will still remain unless you unpublish your tree before you delete it.</p>
      <p>If you delete a tree accidentailly you'll have to get in contact with us to try and recover it.</p>
      <h3>Edit - Tree Details</h3>
      <p>Under <strong>Edit</strong> you can update the tree details you entered when you first created your tree.</p>
      <p>These are things such as the trees title, description or cover image wich all shown in the tree info pane and gallery if the tree is pblished there.</p>
      <h3>Edit - People in Tree</h3>
      <p>Before you start creating your trees links between sims, their children, parents and partners you'll need to have some Sims at hand.</p>
      <p>Going to <strong>Edit</strong> and selecting <strong>People in Tree</strong> takes you to the people manager where you can add, edit or delete people you will be placing in yur tree.</p>
      <p>The guide <strong>Adding/Editing Sims</strong> goes into more details on what you can do there and how.</p>
      <h3>Preview Mode</h3>
      <p>You can toggle preview mode which will hide any buttons in the tree below the toolbar to show you how a tree will look once published.</p>
      <p>Remeber to turn it off to be able to continue to edit the trees structure.</p>
      <h2>The Tree Structure</h2>
      <p>The Plum Tree seperates the Sims and the structure of your trees into two seperate concepts. You'll create some Sims and you'll also create a structure that shows the links between parents and children.</p>
      <p>Then you'll place the Sims you created into the structure you created to form a family tree.</p>
      <img src={treeNode} width='150' style={{ margin: '0px auto', display: 'block' }} />
      <p>When you first create a tree below the toolbar you'll see a single empty <strong>Node</strong>.</p>
      <p>Think of a <strong>Node</strong> as a point in a tree where you'll add a Sim and their partners.</p>
      <p><strong>Nodes</strong> below this one signify the children of the Sim and their partner(s) above.</p>
      <p>Each <strong>Nodes</strong> has two buttons. The one to the left showing the wrench lets you add details to the <strong>Node</strong> such as the Sim, their partners, and details about how the sim of the <strong>Node</strong> was conceived by their parents (i.e. were they adopted, cloned, or result of alien abduction 👽).</p>
      <p>The button below allows you to add child <strong>Nodes</strong>, each you can setup in the same was as the inital <strong>Node</strong> by clicking the wrench for that child.</p>
      <p>You can keep adding as many child <strong>Nodes</strong> to any depth as you need. Just remember you'll need to create the Sims you want to put in a <strong>Node</strong> beforehand.</p>
      <GuideNavLinks
        prevLink='/guides/create-a-tree'
        prevText='Create a Tree'
        nextLink='/guides/create-and-edit-sims'
        nextText='Adding/Editing Sims'
      />
    </div>
  )
}
