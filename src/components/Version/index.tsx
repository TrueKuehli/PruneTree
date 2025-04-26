import React from 'react';
import {Link} from 'react-router-dom';
import Markdown from 'react-markdown';

import * as styles from './styles.scss';


/**
 * Component to display the full details of the current app version.
 */
export default function Version() {
  // Transform the git repo url to a url that can be used to open the repo in the browser.
  const repoUrl = (GIT_REPO_URL.startsWith('git@') ?
      GIT_REPO_URL.replace(':', '/').replace('git@', 'https://') :
      GIT_REPO_URL
  ).replace('.git', '');

  const versionUrl = `${repoUrl}/releases/tag/${PACKAGE_VERSION}`;
  const commitUrl = `${repoUrl}/commit/${COMMIT_HASH}`;
  const shortCommitHash = COMMIT_HASH.substring(0, 7);

  return (
    <>
    <div className={styles.panel}>
      <table>
        <tbody>
        <tr>
          <th>App Version</th>
          <td><Link to={versionUrl} target='_blank' rel='noopener noreferrer'>{PACKAGE_VERSION}</Link></td>
        </tr>
        <tr>
          <th>Last Commit</th>
          <td><Link to={commitUrl} target='_blank' rel='noopener noreferrer'>{shortCommitHash}</Link></td>
        </tr>
        <tr>
          <th>Build Date</th>
          <td>{(new Date(BUILD_DATE)).toLocaleString()}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div className={styles.changelogPanel}>
      <Markdown>{CHANGELOG}</Markdown>
    </div>
    </>
)
  ;
}
