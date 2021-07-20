import React from 'react'
import { Link } from 'react-router-dom'

export default () => {
  return (
    <div className='container'>
      <h1>Support</h1>
      <h2>Contact Us</h2>
      <p>Send us an email to <strong>info@theplumtreeapp.com</strong> if you have trouble getting into your account, found an issue, have a suggestion or just about anything else.</p>
      <h2>FAQ</h2>
      <h3>I forgot my username</h3>
      <p>Head to <Link to='forgot-username'>our forgot username page</Link> and enter your email. We'll send you an email with all the usernames linked to that email address.</p>
      <p>Remember usernames are case sensitive.</p>
      <h3>I forgot my password</h3>
      <p>Head to <Link to='forgot-password'>our forgot password page</Link> and enter your username. We'll email you a unique link that lets you set a new password.</p>
      <h3>I didn't receive my forgot username or password reset email</h3>
      <p>Sometimes automated emails like the ones we send for username reminders or password resets don't get through to your inbox. Check your spam folders and if theres still nothing just send us an email directly at <strong>info@theplumtreeapp.com</strong>.</p>
    </div>
  )
}
