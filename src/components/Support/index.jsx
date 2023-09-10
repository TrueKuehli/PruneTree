import React from 'react'
import { Link } from 'react-router-dom'

export default () => {
  return (
    <div className='container'>
      <h1>Support</h1>
      <h2>FAQ</h2>
      <h3>I forgot my username</h3>
      <p>Head to <Link to='/forgot-username'>our forgot username page</Link> and enter your email. We'll send you an email with all the usernames linked to that email address.</p>
      <p>Remember usernames are case sensitive.</p>
      <h3>I forgot my password</h3>
      <p>Head to <Link to='/forgot-password'>our forgot password page</Link> and enter your username. We'll email you a unique link that lets you set a new password.</p>
      <h3>I didn't receive my forgot username or password reset email</h3>
      <p>Sometimes automated emails like the ones we send for username reminders or password resets don't get through to your inbox so check your spam folders too.</p>
      <h2>Email Me</h2>
      <p>I'm not currently working on new features. I've always been happy to listen to ideas but due to other commitments cannot address most of these.</p>
      <p>Also due to limited time I get on the plum tree and the number of requests that come through I would like to set expectations that responses are likely slow to arrive.</p>
      <p>However if you are facing issues you can get in touch via <strong>theplumtreeinbox@gmail.com</strong> and I'll try to help as best I can.</p>
    </div>
  )
}
