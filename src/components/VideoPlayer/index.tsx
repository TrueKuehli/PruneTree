import React, { useState, useLayoutEffect } from "react";

import styles from "./styles.scss";

type Props = {
  src: string;
};

export default function VideoPlayer({ src }: Props) {
  const [showVideo, setShowVideo] = useState(false);

  useLayoutEffect(() => {
    const videoPlayerAllowed = localStorage.getItem("allow-video-player")
    if (videoPlayerAllowed === "true") {
      allowVideoPlayer()
    }
  }, [])

  const allowVideoPlayer = () => {
    localStorage.setItem("allow-video-player", "true")
    setShowVideo(true)
  }

  return (
    <div className={styles.videoPlayerWrapper}>
      {showVideo ? (
        <iframe src={src} className={styles.videoPlayer} allowFullScreen />
      ) : (
        <div className={`${styles.videoPlayer} ${styles.videoPlayerPlaceholder}`}> 
          <button className='btn btn-primary' onClick={allowVideoPlayer}>Show the video</button>
        </div>
      )}
    </div>
  );
}
