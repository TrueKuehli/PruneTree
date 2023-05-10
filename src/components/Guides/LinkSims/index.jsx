import React from 'react'
import GuideIndexLink from '../GuideIndexLink'
import MobileMock from '../MobileMock'
import linkDetails from './link-details.gif'
import addLink from './add-link.gif'
import GuideNavLinks from '../GuideNavLinks'

export default () => {
  return (
    <div>
      <GuideIndexLink />
      <h1>Link Multiple Trees Together</h1>
      <p>Some Sims like to get around and can find themselves in more than one tree. This guide will take you through linking up those trees.</p>
      <h2>Preperations</h2>
      <p>Before you link two trees the first thing you'll have to do is make sure both trees are public. You can only link public trees since if someone is linked to a tree that isn't published and they don't own it they won't see anything.</p>
      <p>Next you'll have to gather the tree Id and person Id you want to link to. If you want to link back from the tree your linking to you'll have to get these details from both trees.</p>
      <p>To get the tree Id and person Id go to the tree you want to link to.</p>
      <p>Find the person you want to link to in that tree and click their avatar to open the persons details panel.</p>
      <p>At the very bottom is a small link titled <strong>Show Link Details</strong>. Click it to reveal the tree Id and person Id and make a note of each.</p>
      <MobileMock display={linkDetails} />
      <h2>Linking Sims</h2>
      <p>In the tree you want to link from - in the editor toolbar under <strong>Edit</strong> click <strong>People in Tree</strong>.</p>
      <p>Find the Sim you want to link from in the list of Sims and click the <strong>Link</strong> button in that row.</p>
      <p>Enter a title for your link.</p>
      <p>Enter the tree Id and person Id you noted earlier from the tree and person to want to link to.</p>
      <p>Click the <strong>Link Person</strong> button to create the link.</p>
      <MobileMock display={addLink} />
      <p>You can link out to as many trees as you want.</p>
      <p>Remember you may want to link back from the tree your linking to. Just repeat the steps above just the other way around.</p>
      <p>Now anytime your linked person is placed in your tree they will have an icon next to their avatar that reveals a list of the links you created.</p>
      <h2>Removing Links</h2>
      <p>In the tree you want to remove a link from - in the editor toolbar under <strong>Edit</strong> click <strong>People in Tree</strong>.</p>
      <p>Find the Sim you want to remove a link from in the list of Sims and click the <strong>Link</strong> button in that row.</p>
      <p>Find the link you want to remove in the list and click <strong>Delete</strong>.</p>
      <GuideNavLinks
        prevLink='/guides/publising-trees'
        prevText='Publish Your Tree'
      />
    </div>
  )
}
