import React from 'react'
import GuideIndexLink from '../GuideIndexLink'
import GuideNavLinks from '../GuideNavLinks'
import MobileMock from '../MobileMock'
import createTreeGif from './create-tree.gif'
import editTreeGif from './edit-tree.gif'

export default () => {
  return (
    <div>
      <GuideIndexLink />
      <h1>Create a Tree</h1>
      <p>In this guide you can find out how to create your first tree or remind yourself how to add more to your collection.</p>

      <h2>Go To Create a New Tree View</h2>
      <p>You can get to the create tree view by opening the side navigation, Scroll to the <strong>Your Trees</strong> header and <strong>Create New</strong> will always be at the top of this list.</p>

      <MobileMock display={createTreeGif} />

      <h3>The Title, Description &amp; Cover Image</h3>
      <p>A trees Title, Descriptions and Cover Image are shown when a tree is displayed in the gallery and in the tree info pane.</p>
      <p>You can emphasize parts of a trees description using the basic formatting options provided such as <b>Bold</b>, <i>Italic</i> and <u>Underline</u>.</p>
      <p>Once you've set everything you want hit <strong>Create Tree</strong> and you'll be taken to the tree editor for your new tree.</p>
      <h2>Update The Tree Details</h2>
      <p>You can update the details you set when creating your tree by finding <strong>Tree Details</strong> under the <strong>Edit</strong> menu in the tree editor toolbar.</p>
      <MobileMock display={editTreeGif} />
      <GuideNavLinks
        nextLink='/guides/tree-editor'
        nextText='The Tree Editor'
      />
    </div>
  )
}
