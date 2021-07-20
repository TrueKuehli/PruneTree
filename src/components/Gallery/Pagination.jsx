import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import styles from './styles.scss'

class Pagination extends Component {
  render () {
    if (this.props.loading) {
      return (<div />)
    }

    const page = this.props.page
    const totalPages = this.props.totalPages
    const changePage = this.props.changePage

    const activeClass = [styles.paginationBtn, styles.active]

    const search = this.props.search.trim().length > 1 ? `&search=${this.props.search}` : ''
    const prevLink = `gallery?page=${page - 1}${search}`
    const nextLink = `gallery?page=${page + 1}${search}`
    let prevBtn = <Link className={styles.paginationBtn} to={prevLink} onClick={() => changePage(page - 1)}>&laquo;</Link>
    let nextBtn = <Link className={styles.paginationBtn} to={nextLink} onClick={() => changePage(page + 1)}>&raquo;</Link>

    // If we're at the boundary of prev or next use disabled buttons instead
    if (page <= 1) {
      prevBtn = <div className={[styles.paginationBtn, styles.disabled].join(' ')}>&laquo;</div>
    } else if (page >= totalPages) {
      nextBtn = <div className={[styles.paginationBtn, styles.disabled].join(' ')}>&raquo;</div>
    }

    // calculate page numbers
    let pages = []
    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i + 1)
      }
    } else if (page <= 3) {
      pages = [1, 2, 3, 4, 5]
    } else if (page >= totalPages - 2) {
      pages = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    } else {
      pages = [page - 2, page - 1, page, page + 1, page + 2]
    }

    return (
      <div className={styles.paginationContainer}>
        <div className={styles.pagination}>
          {prevBtn}

          {pages.map((pageNum, index) => {
            if (pageNum === page) {
              return (<Link key={index} className={activeClass.join(' ')} to={`gallery?page=${pageNum}${search}`} onClick={() => changePage(pageNum)}>{pageNum}</Link>)
            }
            return (<Link key={index} className={styles.paginationBtn} to={`gallery?page=${pageNum}${search}`} onClick={() => changePage(pageNum)}>{pageNum}</Link>)
          })}

          {nextBtn}
        </div>
        <div className={styles.paginationCount}>{this.props.items} Items, Page {this.props.page} of {this.props.totalPages} pages</div>
      </div>
    )
  }
};

export default Pagination
