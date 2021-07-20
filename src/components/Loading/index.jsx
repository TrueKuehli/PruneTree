import React from 'react'
import styles from './styles.scss'

export default ({ message }) => {
  return (
    <div className={styles.loading}>
      <p>{message}</p>
      <i className='icon-loading icon-spin' />
    </div>
  )
}
