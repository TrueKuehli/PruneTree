import React from 'react'
import GuideIndexLink from '../GuideIndexLink'
import GuideNavLinks from '../GuideNavLinks'

export default () => {
  return (
    <div>
      <GuideIndexLink />
      <h1>Publish Your Tree</h1>
      <p>This guide takes you through how to make your trees public and share them in the gallery.</p>
      <p>When you publish a tree it will be a copy of the tree as it is at the time it was published.</p>
      <p>When you make changes in the tree editor these changes won't show in your published tree until you re-publish it.</p>
      <h2>Make Your Tree Public</h2>
      <p>In the tree editor toolbar go to <strong>Actions</strong> and select <strong>Publish Tree</strong> to open the publish tree view.</p>
      <p>On this page should be a note to say what URL your published tree will be at.</p>
      <p>Enable the switch for <strong>Is Public</strong> and click <strong>Save</strong>.</p>
      <p>Only people who you share the public link with will have access to your tree.</p>
      <p>Feel free to link to it from your own website or embed it using an iframe.</p>
      <h2>Publish Your Tree To The Gallery</h2>
      <p>Publishing a tree to the gallery means it more likely people will find your tree and peruse it.</p>
      <p>In the tree editor toolbar go to <strong>Actions</strong> and select <strong>Publish Tree</strong> to open the publish tree view.</p>
      <p>Enable the switch for <strong>Is Public</strong>.</p>
      <p>Also enable the switch for <strong>Display in Gallery</strong> and click <strong>Save</strong>.</p>
      <h2>Unpublish Your Tree</h2>
      <p>You can unpublish your tree or remove it from the gallery by going to <strong>Actions</strong> and select <strong>Publish Tree</strong> from the tree editor toolbar.</p>
      <p>While in the publish tree view simply disable the switches as desired.</p>
      <p>Click <strong>Save</strong> and your trees public visibility settings will be saved.</p>

      <GuideNavLinks
        prevLink='/guides/placing-sims'
        prevText='Placing Sims in Your Tree'
        nextLink='/guides/linking-sims-to-other-trees'
        nextText='Link Sims Across Multiple Trees'
      />
    </div>
  )
}
