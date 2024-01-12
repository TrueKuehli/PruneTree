import React from 'react';

import {Asset} from '../assets';

import styles from './styles.scss';
import phone from './phone-mock.svg';


type Props = {
  display: Asset;
  alt: string;
};


/**
 * Reusable component that shows a mock mobile phone with a screen presenting the app usage.
 * @param display The image to display on the phone screen.
 * @param alt The alt text for the image.
 */
export default function MobileMock({display, alt}: Props) {
  return (
    <div className={styles.root}>
      <img src={phone} aria-hidden={true} alt='Mock phone frame' width='200' />

      {
        display.mp4 ?
          <video src={display.mp4} autoPlay={true} loop={true} muted={true} className={styles.display}
                 aria-description={alt} width={170}/> :

          display.jpg &&
          <picture>
            {display.webp && <source srcSet={display.webp} type="image/webp"/>}
            <img alt={alt} src={display.jpg} className={styles.display} width={170}/>
          </picture>
      }
    </div>
  );
}
