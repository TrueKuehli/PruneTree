import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import get from 'lodash.get'

import styles from './styles.scss'
import auth from '../../common/js/auth'

class Signup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      email: '',
      password: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (event) {
    event.preventDefault()

    axios.post('/api/account/signup', this.state)
      .then((response) => {
        const token = response.data.token
        const { history } = this.props

        auth.saveToken(token)

        toast.success('Account created!')
        history.push('/')
      })
      .catch((error) => {
        toast.error(get(error, 'response.data.errors[0].detail', 'Unknown error occurred'), { autoClose: false })
      })
  }

  handleChange (event) {
    const newState = {}
    newState[event.target.name] = event.target.value
    this.setState(newState)
  }

  render () {
    return (
      <div className={styles.signupPanel}>
        <h1>Create Account</h1>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label>Username</label>
            <input className='form-control' placeholder='BobPancake100' type='text' name='username' value={this.state.username} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label>Email</label>
            <input className='form-control' placeholder='bob@example.com' type='text' name='email' value={this.state.email} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input className='form-control' type='password' name='password' value={this.state.password} onChange={this.handleChange} />
          </div>
          <button type='submit' className='btn btn-primary'>Create Account</button>
          <p>Already got an account? <Link to='login'>Click here to login.</Link></p>
        </form>
      </div>
    )
  }
};

export default withRouter(Signup)
