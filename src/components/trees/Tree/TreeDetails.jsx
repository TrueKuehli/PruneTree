import React from 'react'
import styles from './styles.scss'
import RawHTML from '../../RawHTML'
import { getUploadedImageUri } from '../../../common/js/utils'

export default ({ title, description, image, style, closeDetails }) => {
  const inlineAvatarStyle = {}
  if (image) {
    inlineAvatarStyle.backgroundImage = `url(${getUploadedImageUri(image, '600x320')})`
  }

  return (
    <div className={styles.treeDetails} style={style}>
      {image && <div className={styles.treeImage} style={inlineAvatarStyle} />}
      <div className={styles.closeButton} onClick={() => closeDetails()}>
        <span>Close</span>
        <i className={styles.close} />
      </div>
      <div className={styles.treeDetailsContent}>
        <h1>{title}</h1>
        <RawHTML html={description} />
      </div>
    </div>
  )
}
