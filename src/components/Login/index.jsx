import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import get from 'lodash.get'

import styles from './styles.scss'
import auth from '../../common/js/auth'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (event) {
    event.preventDefault()

    axios.post('/api/account/signin', this.state)
      .then((response) => {
        const token = get(response, 'data.token')
        const { history } = this.props

        auth.saveToken(token)
        const session = auth.getSession()

        toast.success(`Welcome back ${session.username}!`)
        history.push('/')

        axios.get('/api/trees', { headers: { Authorization: `Bearer ${token}` } })
          .then((response) => {
            this.props.loadUsersTree(response.data)
          })
          .catch((error) => {
            toast.error(get(error, 'response.data.errors[0].detail', 'Oops, we failed fetch your trees. Refresh the page to try again.'), { autoClose: false })
          })
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
      <div className={styles.loginPanel}>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label>Username</label>
            <input className='form-control' type='text' name='username' value={this.state.username} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input className='form-control' type='password' name='password' value={this.state.password} onChange={this.handleChange} autoComplete='on' />
          </div>
          <button type='submit' className='btn btn-primary'>Login</button>
          <p>Not signed up yet? <Link to='signup'>Click here to create an account.</Link></p>
          <p>Forgot your password? <Link to='forgot-password'>Click here to reset it.</Link></p>
          <p>Can't remember your username? <Link to='forgot-username'>Click here retreive it.</Link></p>
        </form>
      </div>
    )
  }
};

export default withRouter(Login)
