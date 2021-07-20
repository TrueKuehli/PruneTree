import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Loading from '../Loading'
import styles from './styles.scss'
import { getUploadedImageUri } from '../../common/js/utils'

class GalleryList extends Component {
  render () {
    if (this.props.loading) {
      return (<Loading message='Loading Gallery' />)
    }

    const trees = this.props.trees
    const arrowIcon = ['fa', 'fa-chevron-right', styles.tileArrow].join(' ')

    return (
      <div className={styles.galleryList}>
        {trees.map((tree) => {
          let coverImage
          let description

          if (tree.cover) {
            const coverCss = { backgroundImage: `url("${getUploadedImageUri(tree.cover)}")` }
            coverImage = <div className={styles.treeTileImage} style={coverCss} />
          }

          if (tree.description) {
            // check if description is just whitespace
            const tmp = document.createElement('DIV')
            tmp.innerHTML = tree.description
            const text = tmp.textContent || tmp.innerText || ''

            if (text.trim().length > 0) {
              description = <div className={styles.treeTileDescription} dangerouslySetInnerHTML={{ __html: tree.description }} />
            }
          }

          return (
            <Link key={tree._id} className={styles.treeTile} to={`/public/${tree._id}`}>
              {coverImage}
              <div className={styles.tileContent}>
                <div className={styles.treeTileInfo}>
                  <div className={styles.treeTileTitle}>{tree.title}</div>
                  {description}
                </div>
                <i className={arrowIcon} />
              </div>
            </Link>
          )
        })}
      </div>
    )
  }
};

export default GalleryList
