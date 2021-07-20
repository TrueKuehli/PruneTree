import React from 'react'
import styles from './styles.scss'

import phone from './phone-mock.svg'

export default (props) => {
  return (
    <div className={styles.root}>
      <img src={phone} width='200' />
      <img src={props.display} className={styles.display} />
    </div>
  )
}
