import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import styles from './styles.scss'
import auth from '../../common/js/auth'

class SideNav extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  componentDidMount () {
    const authToken = auth.getToken()

    if (!authToken) {
      return this.setState({
        loading: false
      })
    }

    this.setState({
      loading: true
    })

    axios.get('/api/trees', { headers: { Authorization: `Bearer ${authToken}` } })
      .then((response) => {
        this.setState({
          loading: false
        })
        this.props.loadUsersTree(response.data)
      })
      .catch((error) => {
        console.error(error)
        this.setState({
          loading: false
        })
      })
  }

  render () {
    const trees = this.props.trees
    const version = COMMITHASH.substring(0, 7)

    return (
      <div>
        <ul className={styles.navList}>
          <li><Link to='/' onClick={this.props.onItemClick}> Home </Link></li>
          <li><Link to='/gallery' onClick={this.props.onItemClick}> Gallery </Link></li>
          <li><Link to='/guides' onClick={this.props.onItemClick}> Guides </Link></li>
          <li><Link to='/donate' onClick={this.props.onItemClick}> Donate </Link></li>
          <li><Link to='/support' onClick={this.props.onItemClick}> Support </Link></li>
        </ul>

        <div className={styles.navTreesHeader}>Your Trees</div>

        {auth.getSession()
          ? (
            <ul className={[styles.navList, styles.lastNav].join(' ')}>
              <li><Link to='/trees/create' onClick={this.props.onItemClick}> Create New </Link></li>
              {trees.map((tree) => {
                const url = `/trees/${tree._id}`
                return <li key={tree._id}><Link to={url} onClick={this.props.onItemClick}> {tree.title} </Link></li>
              })}
            </ul>
            )
          : (
            <p className={styles.menuLoginMessage}>
              <Link to='/login' onClick={this.props.onItemClick}>Login</Link> or <Link to='/signup' onClick={this.props.onItemClick}>Create an Account</Link> to create, view and edit your trees.
            </p>
            )}
        <div className={styles.version}>Version {version}</div>
      </div>
    )
  }
};

export default SideNav
