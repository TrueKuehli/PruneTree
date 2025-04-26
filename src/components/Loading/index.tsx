import React from 'react';

import * as styles from './styles.scss';


type Props = {
  message?: string
}


/**
 * The loading indicator used while the application is waiting for data (e.g. from the IDB).
 * @param message The message to display while loading. No message is displayed if empty.
 */
export default function Loading({message}: Props) {
  return (
    <div className={styles.loading}>
      <p>{message}</p>
      <i className='icon-loading icon-spin' />
    </div>
  );
}
