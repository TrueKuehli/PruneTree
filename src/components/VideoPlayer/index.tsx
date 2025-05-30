import React, {useState, useEffect} from 'react';

import * as styles from './styles.scss';

type Props = {
  src: string;
};

/**
 * Player for videos with placeholder
 * @param src Source for the video
 */
export default function VideoPlayer({src}: Props) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const videoPlayerAllowed = localStorage.getItem('allow-video-player');
    if (videoPlayerAllowed === 'true') {
      allowVideoPlayer();
    }
  }, []);

  const allowVideoPlayer = () => {
    localStorage.setItem('allow-video-player', 'true');
    setShowVideo(true);
  };

  return (
    <div className={styles.videoPlayerWrapper}>
      {showVideo ? (
        <iframe src={src} className={styles.videoPlayer} allowFullScreen />
      ) : (
        <div className={`${styles.videoPlayer} ${styles.videoPlayerPlaceholder}`}>
          <button className='btn btn-primary' onClick={allowVideoPlayer}>Allow YouTube Player</button>
        </div>
      )}
    </div>
  );
}
