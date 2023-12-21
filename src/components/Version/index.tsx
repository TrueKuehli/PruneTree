import React from 'react';

import styles from './styles.scss';


/**
 * Component to display the full details of the current app version.
 */
export default function Version() {
  return (
    <div className={styles.panel}>
      <table>
        <tbody>
          <tr>
            <th>App Version</th>
            <td>{PACKAGE_VERSION}</td>
          </tr>
          <tr>
            <th>Last Commit</th>
            <td>{COMMIT_HASH.substring(0, 7)}</td>
          </tr>
          <tr>
            <th>Build Date</th>
            <td>{BUILD_DATE}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
