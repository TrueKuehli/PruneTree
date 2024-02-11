import React from 'react'

import styles from './styles.scss';

type Props = {
    src: string
}

export default function VideoPlayer({src} : Props) {
  return (
    <div className={styles.guideVideo}>
        <iframe width='560' height='315' src={src}
            style={{border: 'none'}} allowFullScreen />
    </div>
  )
}
