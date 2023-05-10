import React from 'react'
import MobileMock from '../MobileMock'
import GuideIndexLink from '../GuideIndexLink'
import GuideNavLinks from '../GuideNavLinks'
import customTrait from './custom-trait.gif'
import simInfoPanel from './sim-info-panel.gif'

export default () => {
  return (
    <div>
      <GuideIndexLink />
      <h1>Adding/Editing Sims</h1>
      <p>Every Sims family tree needs Sims so in these guides find out how to add, edit and all about the details you can give your sims to tell their life stories.</p>
      <h2>Add A New Sim</h2>
      <p>From the tree editor in the toolbar click <strong>Edit</strong> and select <strong>People in Tree</strong>.</p>
      <p>You'll be shown the people manager view and from here click the <strong>Add Someone New</strong> button.</p>
      <p>Fill out the details about your Sim and hit <strong>Create Person</strong> at the bottom of the page.</p>
      <h2>Edit A Sim</h2>
      <p>Once you've created a Sim you can always go back to update them. This will update that Sim anywhere they are placed in the tree too.</p>
      <p>From the tree editor in the toolbar click <strong>Edit</strong> and select <strong>People in Tree</strong>.</p>
      <p>You'll be shown the people manager. Find the Sim you want to edit in the list and click the <strong>Edit</strong> button toward the top right of that row.</p>
      <p>Fill out the details about your Sim and hit <strong>Update Person</strong> at the bottom of the page.</p>
      <h2>Your Sims Details</h2>
      <p>The details you add to your Sim will show up when they are clicked in the tree in a panel to the right.</p>
      <MobileMock display={simInfoPanel} />
      <p>The details and some information on each is as follows:</p>
      <dl>
        <dt>Avatar</dt>
        <dd>Upload and crop (if needed) a picture of your Sim</dd>
        <dt>First and Last Name</dt>
        <dd>Name your Sim</dd>
        <dt>Description</dt>
        <dd>Give your Sim a story. Write a short bio or any other details you want and feel free to format it using the formatting options.</dd>
        <dt>Traits, Aspirations and Life States</dt>
        <dd>
          Start typing to reveal options from the dropdown. You can add as many items to these as you want and if what you want isn't there you can add your own items too.
          <div style={{ textAlign: 'center' }}>
            <img src={customTrait} width='290' style={{ display: 'block', margin: '0px auto' }} />
            <small>Example of adding custom traits</small>
          </div>
        </dd>
        <dt>More (Custom)</dt>
        <dd>Add any other details that can be displayed as a title and value. These items will be shown as a simple table in the Sims info panel.</dd>
      </dl>
      <GuideNavLinks
        prevLink='/guides/tree-editor'
        prevText='The Tree Editor'
        nextLink='/guides/placing-sims'
        nextText='Placing Sims in Your Tree'
      />
    </div>
  )
}
