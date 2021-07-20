import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import get from 'lodash.get'
import { toast } from 'react-toastify'
import querystring from 'querystring'

import styles from './styles.scss'

class ForgotPassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      password: '',
      confirmPassword: ''
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

    let search = get(this, 'props.location.search', '')
    if (search.charAt(0) === '?') {
      search = search.substr(1)
    }

    const urlParams = querystring.parse(search)
    const { password, confirmPassword } = this.state
    const { history } = this.props
    const token = urlParams.t
    const username = urlParams.u

    if (password !== confirmPassword) {
      return toast.warn('Your new password and the confirm password does not match')
    }

    axios.post('/api/account/resetpassword', { username, password, token })
      .then((response) => {
        toast.success('Password has been saved')
        history.push('/')
      })
      .catch((error) => {
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred'), { autoClose: false })
      })
  }

  render () {
    return (
      <div className={styles.resetPasswordPanel}>
        <h1>Reset Password</h1>
        <p>Enter what you want your new password to be.</p>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label>New Password</label>
            <input className='form-control' type='password' name='password' value={this.state.password} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label>Confirm Password</label>
            <input className='form-control' type='password' name='confirmPassword' value={this.state.confirmPassword} onChange={this.handleChange} />
          </div>
          <button type='submit' className='btn btn-primary'>Submit</button>
        </form>
      </div>
    )
  }
};

export default withRouter(ForgotPassword)
