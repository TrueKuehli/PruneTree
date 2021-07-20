import React, { Component } from 'react'
import axios from 'axios'
import get from 'lodash.get'

class SiteStats extends Component {
  constructor (props) {
    super(props)

    this.state = {
      error: null,
      userCount: null,
      treeCount: null,
      imageCount: null,
      publishedTreesCount: null
    }

    this.getStats = this.getStats.bind(this)
  }

  componentDidMount () {
    this.getStats()
  }

  getStats () {
    clearInterval(this.state.intervalId)
    axios.get('/api/stats')
      .then((response) => {
        const stats = get(response, 'data', {})
        const {
          userCount,
          treeCount,
          imageCount,
          publishedTreesCount
        } = stats

        if (userCount && treeCount && imageCount && publishedTreesCount) {
          this.setState({
            userCount,
            treeCount,
            imageCount,
            publishedTreesCount
          })
        } else {
          this.setState({
            error: 'Failed to gather site stats.'
          })
        }
      })
      .catch((error) => {
        console.error(error)
        this.setState({
          error: 'Failed to gather site stats.'
        })
      })
  }

  render () {
    if (this.state.error) {
      return null
    }

    return (
      <div>
        <h2>Some Stats We're Proud Of</h2>
        <p>Looks like our user have been busy creating trees so we thought we should share some stats so you can see just how busy our users have been.</p>
        <table className='table' style={{ maxWidth: 500, margin: '20px auto' }}>
          <tbody>
            <tr>
              <th>Users Signed Up</th>
              <td>{this.state.userCount}</td>
            </tr>
            <tr>
              <th>Trees Created</th>
              <td>{this.state.treeCount}</td>
            </tr>
            <tr>
              <th>Trees Published</th>
              <td>{this.state.publishedTreesCount}</td>
            </tr>
            <tr>
              <th>Images Uploaded</th>
              <td>{this.state.imageCount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
};

export default SiteStats
