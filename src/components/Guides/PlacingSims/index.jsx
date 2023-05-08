import React from 'react'
import GuideIndexLink from '../GuideIndexLink'
import GuideNavLinks from '../GuideNavLinks'
import MobileMock from '../MobileMock'
import setNodePerson from './set-node-person.gif'
import addPartner from './add-partner.gif'
import parents from './parents.gif'

export default () => {
  return (
    <div>
      <GuideIndexLink />
      <h1>Placing Sims in Your Tree</h1>
      <p>Sims and tree structures are two seperate things in The Plum Tree so once you've added some Sims you'll want to master how place them to form a tree.</p>
      <div className='side-note'>Remember you'll have to have already created your Sims before you can place them in a tree</div>
      <h2>Add Your Sim</h2>
      <p>To set the Sim for a node click the <strong>Wrench Icon</strong> on a node.</p>
      <p>Click <strong>Set This Nodes Person</strong> and select one of you Sims from the dropdown.</p>
      <MobileMock display={setNodePerson} />
      <h2>Add Your Sims Partners</h2>
      <p>To set a Sims partners in a node click the <strong>Wrench Icon</strong> on a node.</p>
      <p>Click <strong>Set This Nodes Partners</strong>.</p>
      <p>Add partner rows using the <strong>Add Partner</strong> button. These will be displayed above each other to the right of the Node person.</p>
      <p>You can add multiple Sims into each partner row you add. These will display to the right of each previous partner in that row.</p>
      <p>It's up to you how you organise a node partners. Some people use multiple partners in a row to show a partners other partners. Others use it when a lots of partners take up too much space obove each other.</p>
      <p>When you're done click <strong>Save</strong>.</p>
      <MobileMock display={addPartner} />
      <h2>Adding Children</h2>
      <p>To add children to a tree click the <strong>Plus Icon</strong> below a node.</p>
      <p>On the new node click the <strong>Wrench Icon</strong> and set the Node person as described above.</p>
      <p>When you're in the Node edit main screen go down and click <strong>Set This Nodes Parent Details </strong>.</p>
      <p>When you set the nodes parents this information will be in that Sims info panel. This is useful if a parent Node has many partners, the child was adopted or something else that isn't made apparent by the tree itself.</p>
      <MobileMock display={parents} />
      <h2>Delete a Node</h2>
      <p>To delete a node <strong>and all of its child nodes</strong> click the <strong>Wrench Icon</strong> on a node.</p>
      <p>Scroll down to the bottom of the edit node page and click <strong>Delete This Node</strong> and confirm you want to delete it.</p>
      <GuideNavLinks
        prevLink='/guides/create-and-edit-sims'
        prevText='Adding/Editing Sims'
        nextLink='/guides/publising-trees'
        nextText='Publish Your Tree'
      />
    </div>
  )
}
