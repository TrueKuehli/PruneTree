import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import get from 'lodash.get'

import styles from './styles.scss'
import auth from '../../common/js/auth'

export default () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit (event) {
    event.preventDefault()

    axios.post('/api/account/signup', { username, email, password })
      .then((response) => {
        const token = response.data.token

        auth.saveToken(token)

        toast.success('Account created!')
        navigate('/')
      })
      .catch((error) => {
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred'), { autoClose: false })
      })
  }

  return (
    <div className={styles.signupPanel}>
      <Link to='/sunset' className={styles.sunsetAlert}>The Plum Tree App will be shutting down. Click to find out more.</Link>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Username</label>
          <input id='username-input' className='form-control' placeholder='BobPancake100' type='text' name='username' value={username} onChange={ev => setUsername(ev.target.value)} />
        </div>
        <div className='form-group'>
          <label>Email</label>
          <input id='email-input' className='form-control' placeholder='bob@example.com' type='text' name='email' value={email} onChange={ev => setEmail(ev.target.value)} />
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input id='password-input' className='form-control' type='password' name='password' value={password} onChange={ev => setPassword(ev.target.value)} />
        </div>
        <button id='signup-submit' type='submit' className='btn btn-primary'>Create Account</button>
        <p>Already got an account? <Link to='/login'>Click here to login.</Link></p>
      </form>
    </div>
  )
}
