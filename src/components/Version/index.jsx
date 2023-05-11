import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Loading from '../Loading'
import styles from './styles.scss'

export default () => {
  const [loading, setLoading] = useState(true)
  const [apiVersion, setApiVersion] = useState('unknown')
  const [apiColor, setApiColor] = useState('unknown')

  useEffect(() => {
    axios.get('/api/version')
      .then(({ data: { version, color } }) => {
        setApiVersion(version)
        setApiColor(color)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Loading message='Getting version details' />
    )
  }

  return (
    <div className={styles.panel}>
      <table>
        <tr>
          <th>API Version</th>
          <td>{apiVersion}</td>
        </tr>
        <tr>
          <th>API Color</th>
          <td>{apiColor}</td>
        </tr>
        <tr>
          <th>UI Version</th>
          <td>{COMMITHASH.substring(0, 7)}</td>
        </tr>
        <tr>
          <th>UI Color</th>
          <td>{STACK}</td>
        </tr>
      </table>
    </div>
  )
}
