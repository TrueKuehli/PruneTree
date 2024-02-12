import React from "react";
import { useState } from "react";

import styles from "./styles.scss";

type Props = {
  src: string;
};

export default function VideoPlayer({ src }: Props) {
  const [showVideo, setShowVideo] = useState(false);

  const clickShowVideoBtn = () => {
    setShowVideo(true)
  }

  return (
    <div className={styles.videoPlayerWrapper}>
      {showVideo ? (
        <iframe src={src} className={styles.videoPlayer} allowFullScreen />
      ) : (
        <div className={`${styles.videoPlayer} ${styles.videoPlayerPlaceholder}`}> 
          <button className='btn btn-primary' onClick={clickShowVideoBtn}>Show the video</button>
        </div>
      )}
    </div>
  );
}
