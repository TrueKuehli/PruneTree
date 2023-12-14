import React, {useEffect, useState} from 'react'
import styles from './styles.scss'
import RawHTML from '../../RawHTML'
import { getImageUri } from '../../../common/js/utils'
import {toast} from "react-toastify";
import get from "lodash.get";

export default ({ title, description, image, style, closeDetails }) => {
  const [imageUri, setImageUri] = useState(null)

  useEffect(() => {
    if (image) {
      getImageUri(image).then(
        (response) => {
          setImageUri(response)
        })
        .catch((error) => {
          toast.error(get(error, 'message', 'Unknown error occurred creating tree'), { autoClose: false })
        })
    }
  }, [image])

  return (
    <div className={styles.treeDetails} style={style}>
      {image && <div className={styles.treeImage} style={{backgroundImage: imageUri ? `url(${imageUri.url})` : 'initial'}} />}
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
