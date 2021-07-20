import React, { Component } from 'react'
import styles from './styles.scss'
import axios from 'axios'
import get from 'lodash.get'
import moment from 'moment'

const STATUS_RENDER_TIME = 10000 // 10 seconds
const REPEAT_CHECK_TIME = 300000 // 5 minutes

class ServerStatus extends Component {
  constructor (props) {
    super(props)

    this.state = {
      healthy: null,
      intervalId: null,
      runTime: 0
    }

    this.timer = this.timer.bind(this)
  }

  /**
   * The timer to re-render the status last checked message. Runs a new status
   * check if running time is greater then REPEAT_CHECK_TIME.
   * @return {void}
   */
  timer () {
    const runTime = this.state.runTime + STATUS_RENDER_TIME

    // increment run time
    this.setState({
      runTime
    })

    if (runTime >= REPEAT_CHECK_TIME) {
      this.checkStatus()
    }
  }

  componentDidMount () {
    this.checkStatus()
  }

  checkStatus () {
    clearInterval(this.state.intervalId)
    axios.get('/api/health')
      .then((response) => {
        const message = get(response, 'data.message')
        const intervalId = setInterval(this.timer, STATUS_RENDER_TIME)

        if (message === 'All herping and no derping.') {
          this.setState({
            healthy: true,
            intervalId,
            runTime: 0
          })
        } else {
          this.setState({
            healthy: false,
            intervalId,
            runTime: 0
          })
        }
      })
      .catch((error) => {
        console.error(error)
        const intervalId = setInterval(this.timer, STATUS_RENDER_TIME)
        this.setState({
          healthy: false,
          intervalId,
          runTime: 0
        })
      })
  }

  componentWillUnmount () {
    clearInterval(this.state.intervalId)
  }

  render () {
    const state = this.state
    let message
    let alertClassName
    const humanized = moment.duration(state.runTime, 'milliseconds').humanize()
    let lastChecked = `Refreshed ${humanized} ago`

    if (state.healthy === null) {
      message = 'Checking server status...'
      alertClassName = 'alert-info'
      lastChecked = ''
    } else if (state.healthy) {
      message = 'Server Status is Fine'
      alertClassName = 'alert-success'
    } else {
      message = 'Server Down!'
      alertClassName = 'alert-danger'
    }

    return (
      <div className={[styles.serverStatus, alertClassName, 'alert'].join(' ')}>
        <div className='alert-body'>
          {message}
        </div>
        <small className={styles.statusCheckTime}>{lastChecked}</small>
      </div>
    )
  }
};

export default ServerStatus
