import React, { Component } from 'react'
import axios from 'axios'
import get from 'lodash.get'
import { toast } from 'react-toastify'

import Loading from '../Loading'
import styles from './styles.scss'

class ForgotPassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (event) {
    const newState = {}
    newState[event.target.name] = event.target.value
    this.setState(newState)
  }

  handleSubmit (event) {
    event.preventDefault()

    axios.post('/api/account/forgotpassword', this.state)
      .then((response) => {
        toast.success('You should receive an email with password reset instructions shortly')
      })
      .catch((error) => {
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred'), { autoClose: false })
      })
  }

  render () {
    if (this.state.loading) {
      return (<Loading message='Loading your account details...' />)
    }

    return (
      <div className={styles.forgotPasswordPanel}>
        <h1>Forgot Password</h1>
        <p>Forgot your password? Just tell us your username and we'll email you instructions on how to reset your password.</p>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label>Username</label>
            <input className='form-control' type='text' name='username' value={this.state.username} onChange={this.handleChange} />
          </div>
          <button type='submit' className='btn btn-primary'>Submit</button>
        </form>
      </div>
    )
  }
};

export default ForgotPassword
