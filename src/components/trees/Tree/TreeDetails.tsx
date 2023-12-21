import React, {CSSProperties, useEffect, useState} from 'react';
import {toast} from 'react-toastify';

import {getImageUri, ImageURL} from '../../../common/scripts/dataUrl';
import RawHTML from '../../RawHTML';

import styles from './styles.scss';


type Props = {
  title: string,
  description: string,
  image: number,
  style: CSSProperties,
  closeDetails: () => void,
}


/**
 * The TreeDetails component renders the details of a tree.
 * @param title The title of the tree.
 * @param description The description of the tree.
 * @param image The cover image ID of the tree.
 * @param style The style to apply to the component.
 * @param closeDetails The function to call to close the details.
 */
export default function TreeDetails({title, description, image, style, closeDetails}: Props) {
  const [imageUri, setImageUri] = useState<ImageURL>(null);

  useEffect(() => {
    if (image) {
      getImageUri(image).then(
        (response) => {
          setImageUri(response);
        })
        .catch((err) => {
          toast.error(err?.message || 'Unknown error occurred creating tree', {autoClose: false});
        });
    }
  }, [image]);

  return (
    <div className={styles.treeDetails} style={style}>
      {image && <div className={styles.treeImage}
                     style={{backgroundImage: imageUri ? `url(${imageUri.url})` : 'initial'}} />}
      <div className={styles.closeButton} onClick={() => closeDetails()}>
        <span>Close</span>
        <i className={styles.close} />
      </div>
      <div className={styles.treeDetailsContent}>
        <h1>{title}</h1>
        <RawHTML html={description} />
      </div>
    </div>
  );
}
