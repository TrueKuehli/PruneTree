import React, { Component } from 'react'
import axios from 'axios'
import get from 'lodash.get'
import { toast } from 'react-toastify'

import styles from './styles.scss'

class ForgotUsername extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: ''
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

    const { email } = this.state

    if (!email) {
      return toast.error('Email address is required', { autoClose: false })
    }

    axios.post('/api/account/forgotusername', { email })
      .then((response) => {
        toast.success('You should receive an email with your username(s) shortly')
      })
      .catch((error) => {
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred'), { autoClose: false })
      })
  }

  render () {
    return (
      <div className={styles.forgotUsernamePanel}>
        <h1>Forgot Username</h1>
        <p>Forgot your username? Enter the email you used to signup with and we'll send you all the usernames linked to it.</p>
        <div className='side-note'>Note that usernames are case sensitive as this can catch people out from time to time.</div>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label>Email</label>
            <input className='form-control' type='email' name='email' value={this.state.email} onChange={this.handleChange} />
          </div>
          <button type='submit' className='btn btn-primary'>Submit</button>
        </form>
      </div>
    )
  }
};

export default ForgotUsername
