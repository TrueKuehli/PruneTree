import React from 'react'
import styles from './styles.scss'

export default () => {
  return (
    <div className={styles.panel}>
      <table>
        <tbody>
          <tr>
            <th>UI Version</th>
            <td>{COMMITHASH.substring(0, 7)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
