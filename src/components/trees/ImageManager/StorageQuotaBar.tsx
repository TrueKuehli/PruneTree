import React from 'react';

import * as styles from './styles.scss';


type Props = {
  storageQuota: number,
  storageUsage: number,
}

type CustomCSSProps = React.CSSProperties & {
  '--percentage': string,
};


/**
 * The StorageQuotaBar component shows the user how much storage space they have left.
 */
export default function StorageQuotaBar({storageQuota, storageUsage}: Props) {
  if (storageUsage === null || !storageQuota) return null;

  const progress = {
    '--percentage': `${storageUsage / storageQuota * 100}%`,
  } as CustomCSSProps;

  // Choose appropriate units to display
  const storageBytes = storageQuota > 1_000_000_000 ?
    `${(storageUsage / 1_000_000_000).toFixed(2)} GB` :
    storageQuota > 1_000_000 ?
      `${(storageUsage / 1_000_000).toFixed(2)} MB` :
      `${(storageUsage / 1_000_000).toFixed(2)} KB`;

  return (
    <div className={styles.quotaWrapper}>
      Storage Usage
      <div className={styles.quotaBar}>
        <div className={styles.quotaBarProgress} style={progress}/>
        <span>{Math.ceil(storageUsage / storageQuota * 100)}%</span>
        <span> ({storageBytes})</span>
      </div>
    </div>
  );
}
