import React, {CSSProperties} from 'react';

import RawHTML from '../../RawHTML';

import * as styles from '../Tree/styles.scss';


type Props = {
  title: string,
  description: string,
  image: number,
  style: CSSProperties,
  closeDetails: () => void,
}


/**
 * Renders the details panel in the tree viewer, showing name, description and cover image of the current tree.
 * @param title The title of the tree.
 * @param description The description of the tree.
 * @param image The cover image ID of the tree.
 * @param style The style to apply to the component.
 * @param closeDetails The function to call to close the details.
 */
export default function TreeDetails({title, description, image, style, closeDetails}: Props) {
  const inlineAvatarStyle: CSSProperties = {};
  if (image) {
    inlineAvatarStyle.backgroundImage = `url(./images/${image}.jpg)`;
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
  );
}
