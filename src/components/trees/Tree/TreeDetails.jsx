import React, { Component } from 'react'
import styles from './styles.scss'
import RawHTML from '../../RawHTML'
import { getUploadedImageUri } from '../../../common/js/utils'

class TreeDetails extends Component {
  render () {
    const inlineAvatarStyle = {}
    if (this.props.image) {
      inlineAvatarStyle.backgroundImage = `url(${getUploadedImageUri(this.props.image, '300x160')})`
    }

    return (
      <div className={styles.treeDetails} style={this.props.style}>
        {this.props.image && <div className={styles.treeImage} style={inlineAvatarStyle} />}
        <div className={styles.closeButton} onClick={() => this.props.closeDetails()}>
          <span>Close</span>
          <i className={styles.close} />
        </div>
        <div className={styles.treeDetailsContent}>
          <h1>{this.props.title}</h1>
          <RawHTML html={this.props.description} />
        </div>
      </div>
    )
  }
};

export default TreeDetails
