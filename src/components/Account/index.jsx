import React, { useState, useEffect } from 'react'
import axios from 'axios'
import get from 'lodash.get'
import { toast } from 'react-toastify'
import Loading from '../Loading'
import auth from '../../common/js/auth'
import { isValidEmail } from '../../common/js/utils'
import styles from './styles.scss'

export default () => {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [email, setEmail] = useState('')
  const [oldPassword, setOldPassword] = useState('') // current password when user it updating password
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    const authToken = auth.getToken()

    if (!authToken) {
      setLoading(false)
      return toast.error('Looks like you\'re not logged in', { autoClose: false })
    }

    axios.get('/api/user', { headers: { Authorization: `Bearer ${authToken}` } })
      .then((response) => {
        setEmail(get(response, 'data.email', ''))
        setUsername(get(response, 'data._id', ''))
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
        toast.error('Failed to get account info', { autoClose: false })
      })
  }, [])

  function handleChange (ev) {
    const inputName = ev.target.name
    const inputValue = ev.target.value

    switch (inputName) {
      case 'email':
        setEmail(inputValue)
        break
      case 'oldPassword':
        setOldPassword(inputValue)
        break
      case 'newPassword':
        setNewPassword(inputValue)
        break
      case 'confirmPassword':
        setConfirmPassword(inputValue)
        break
    }
  }

  function handleEmailSubmit (ev) {
    ev.preventDefault()

    const authToken = auth.getToken()

    if (!authToken) {
      return toast.error('Looks like you\'re not logged in', { autoClose: false })
    }

    if (!isValidEmail(email)) {
      return toast.warn('Looks like your new email is not valid', { autoClose: false })
    }

    axios.put('/api/user/email',
      { email },
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
      .then(() => {
        toast.success('Your email address has been updated')
      })
      .catch((error) => {
        console.error(error)
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred updating your email'), { autoClose: false })
      })
  }

  function handlePasswordSubmit (ev) {
    ev.preventDefault()

    const authToken = auth.getToken()

    if (!authToken) {
      return toast.error('Looks like you\'re not logged in', { autoClose: false })
    }

    if (newPassword !== confirmPassword) {
      return toast.warn('Looks like your new and confirmation passwords don\'t match', { autoClose: false })
    }

    if (newPassword.length < 8) {
      return toast.warn('Your new password should be at least 8 characters', { autoClose: false })
    }

    axios.put('/api/user/password',
      {
        oldPassword,
        newPassword,
        confirmPassword
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
      .then(() => {
        toast.success('Your password has been updated')
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      })
      .catch((error) => {
        console.error(error)
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred updating your password'), { autoClose: false })
      })
  }

  if (loading) {
    return <Loading message='Loading your account details...' />
  }

  return (
    <div className='container'>
      <h1>Account Settings <span className={styles.username}>({username})</span></h1>
      <p>In account settings you can update your email address and/or password.</p>
      <div className='row'>
        <div className='col-12 col-md-6'>
          <h2>Update Email</h2>
          <div className='side-note'>
            <p>It's important to keep your email address up to date incase you ever need to reset your password.</p>
          </div>
          <form onSubmit={handleEmailSubmit}>
            <div className='form-group'>
              <label>Email</label>
              <input className='form-control' placeholder='bob@example.com' type='email' name='email' value={email} onChange={handleChange} />
            </div>
            <button type='submit' className='btn btn-primary'>Update Email</button>
          </form>
        </div>
        <div className='col-12 col-md-6'>
          <h2>Update Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className='form-group'>
              <label>Current Password</label>
              <input className='form-control' type='password' name='oldPassword' value={oldPassword} onChange={handleChange} autoComplete='off' />
            </div>
            <div className='form-group'>
              <label>New Password</label>
              <input className='form-control' type='password' name='newPassword' value={newPassword} onChange={handleChange} autoComplete='off' />
            </div>
            <div className='form-group'>
              <label>Confirm Password</label>
              <input className='form-control' type='password' name='confirmPassword' value={confirmPassword} onChange={handleChange} autoComplete='off' />
            </div>
            <button type='submit' className='btn btn-primary'>Update Password</button>
          </form>
        </div>
      </div>
    </div>
  )
}
