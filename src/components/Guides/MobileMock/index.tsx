import React from 'react';

import styles from './styles.scss';
import phone from './phone-mock.svg';


type Props = {
  display: string;
};


/**
 * Reusable component that shows a mock mobile phone with a screen presenting the app usage.
 * @param display The image to display on the phone screen.
 */
export default function MobileMock({display}: Props) {
  return (
    <div className={styles.root}>
      <img src={phone} aria-hidden={true} alt="Mock phone frame" width='200' />
      <img src={display} alt="Usage demonstration on a mobile phone" className={styles.display} />
    </div>
  );
}
