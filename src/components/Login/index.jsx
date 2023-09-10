import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import get from 'lodash.get'
import styles from './styles.scss'
import auth from '../../common/js/auth'

export default ({ loadUsersTree }) => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit (event) {
    event.preventDefault()

    axios.post('/api/account/signin', { username, password })
      .then((response) => {
        const token = get(response, 'data.token')

        auth.saveToken(token)
        const session = auth.getSession()

        toast.success(`Welcome back ${session.username}!`)
        navigate('/')

        axios.get('/api/trees', { headers: { Authorization: `Bearer ${token}` } })
          .then((response) => {
            loadUsersTree(response.data)
          })
          .catch((error) => {
            toast.error(get(error, 'response.data.errors[0].detail', 'Oops, we failed fetch your trees. Refresh the page to try again.'), { autoClose: false })
          })
      })
      .catch((error) => {
        console.log(error)
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred'), { autoClose: false })
      })
  }

  return (
    <div className={styles.loginPanel}>
      <Link to='/sunset' className={styles.sunsetAlert}>The Plum Tree App will be shutting down. Click to find out more.</Link>

      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Username</label>
          <input id='username-input' className='form-control' type='text' name='username' value={username} onChange={ev => setUsername(ev.target.value)} />
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input id='password-input' className='form-control' type='password' name='password' value={password} onChange={ev => setPassword(ev.target.value)} autoComplete='on' />
        </div>
        <button id='login-submit' type='submit' className='btn btn-primary'>Login</button>
        <p>Not signed up yet? <Link to='/signup'>Click here to create an account.</Link></p>
        <p>Forgot your password? <Link to='/forgot-password'>Click here to reset it.</Link></p>
        <p>Can't remember your username? <Link to='/forgot-username'>Click here retreive it.</Link></p>
      </form>
    </div>
  )
}
