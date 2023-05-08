import React, { useState } from 'react'
import axios from 'axios'
import get from 'lodash.get'
import { toast } from 'react-toastify'
import styles from './styles.scss'

export default () => {
  const [username, setUsername] = useState('')

  function handleSubmit (event) {
    event.preventDefault()

    axios.post('/api/account/forgotpassword', { username })
      .then(() => {
        toast.success('You should receive an email with password reset instructions shortly')
      })
      .catch((error) => {
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred'), { autoClose: false })
      })
  }

  return (
    <div className={styles.forgotPasswordPanel}>
      <h1>Forgot Password</h1>
      <p>Forgot your password? Just tell us your username and we'll email you instructions on how to reset your password.</p>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Username</label>
          <input className='form-control' type='text' name='username' value={username} onChange={(ev) => setUsername(ev.target.value)} />
        </div>
        <button type='submit' className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}
