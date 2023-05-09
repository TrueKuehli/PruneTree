import React from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'

export default ({ loading, page, items, totalPages, changePage, search }) => {
  if (loading) {
    return (<div />)
  }

  const activeClass = [styles.paginationBtn, styles.active]
  const searchQuery = search.trim().length > 1 ? `&search=${search}` : ''
  const prevLink = `/gallery?page=${page - 1}${searchQuery}`
  const nextLink = `/gallery?page=${page + 1}${searchQuery}`

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
            return (<Link key={index} className={activeClass.join(' ')} to={`/gallery?page=${pageNum}${search}`} onClick={() => changePage(pageNum)}>{pageNum}</Link>)
          }
          return (<Link key={index} className={styles.paginationBtn} to={`/gallery?page=${pageNum}${search}`} onClick={() => changePage(pageNum)}>{pageNum}</Link>)
        })}

        {nextBtn}
      </div>
      <div className={styles.paginationCount}>{items} Items, Page {page} of {totalPages} pages</div>
    </div>
  )
}
