import React, { useState } from 'react'
import axios from 'axios'
import get from 'lodash.get'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router-dom'

import styles from './styles.scss'

export default () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleSubmit (event) {
    event.preventDefault()

    const token = searchParams.get('t')
    const username = searchParams.get('u')

    if (password !== confirmPassword) {
      return toast.warn('Your new password and the confirm password does not match')
    }

    axios.post('/api/account/resetpassword', { username, password, token })
      .then((response) => {
        toast.success('Password has been saved')
        navigate('/')
      })
      .catch((error) => {
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred'), { autoClose: false })
      })
  }

  return (
    <div className={styles.resetPasswordPanel}>
      <h1>Reset Password</h1>
      <p>Enter what you want your new password to be.</p>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>New Password</label>
          <input className='form-control' type='password' name='password' value={password} onChange={ev => setPassword(ev.target.value)} />
        </div>
        <div className='form-group'>
          <label>Confirm Password</label>
          <input className='form-control' type='password' name='confirmPassword' value={confirmPassword} onChange={ev => setConfirmPassword(ev.target.value)} />
        </div>
        <button type='submit' className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}
