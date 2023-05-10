import React, { useState } from 'react'
import axios from 'axios'
import get from 'lodash.get'
import { toast } from 'react-toastify'
import styles from './styles.scss'

export default () => {
  const [email, setEmail] = useState('')

  function handleSubmit (event) {
    event.preventDefault()

    if (!email) {
      return toast.error('Email address is required', { autoClose: false })
    }

    axios.post('/api/account/forgotusername', { email })
      .then(() => {
        toast.success('You should receive an email with your username(s) shortly')
      })
      .catch((error) => {
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred'), { autoClose: false })
      })
  }

  return (
    <div className={styles.forgotUsernamePanel}>
      <h1>Forgot Username</h1>
      <p>Forgot your username? Enter the email you used to signup with and we'll send you all the usernames linked to it.</p>
      <div className='side-note'>Note that usernames are case sensitive as this can catch people out from time to time.</div>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Email</label>
          <input className='form-control' type='email' name='email' value={email} onChange={(ev) => setEmail(ev.target.value)} />
        </div>
        <button type='submit' className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}
