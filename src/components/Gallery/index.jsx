import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import get from 'lodash.get'
import Pagination from './Pagination'
import GalleryList from './GalleryList'
import styles from './styles.scss'

export default ({ location }) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [trees, setTrees] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setSearch(searchParams.get('search') || '')
  }, [])

  useEffect(() => {
    loadGalleryItems()
  }, [search])

  function loadGalleryItems (page) {
    // if we didn't load the page use the page URL query parameter or default to
    // page 1
    if (!page) {
      page = parseInt(searchParams.get('page')) || 1
    }

    setTrees([])
    setPage(page)
    setLoading(true)
    setTotalPages(0)// we don't know the total pages at this point

    axios.get(`/api/published?page[number]=${page}&search=${search}`)
      .then((response) => {
        setTotalPages(get(response, 'data.meta.totalPages', null))
        setTrees(get(response, 'data.data', []))
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        toast.error(get(error, 'response.data.errors[0].detail', 'Error when loading gallery trees'), { autoClose: false })
      })
  }

  function handleSearchSubmit (event) {
    event.preventDefault()

    if (search.trim().length > 1) {
      navigate(`/gallery?page=1&search=${search}`)
    } else {
      navigate('/gallery?page=1')
    }

    loadGalleryItems(1)
  }

  return (
    <div>
      <div className={styles.headerMask} />
      <div className='container'>
        <div className={styles.galleryHead}>
          <h1 className={styles.galleryTitle}>Gallery</h1>
          <form onSubmit={handleSearchSubmit}>
            <div className='input-group' styles='max-wid'>
              <div className='form-group'>
                <label className='sr-only'>Search</label>
                <input className='form-control' type='text' name='search' placeholder='Search' value={search} onChange={ev => setSearch(ev.target.value)} />
              </div>
              <button type='submit' className='btn btn-primary'>Search</button>
            </div>
          </form>
          <Pagination
            loading={loading}
            page={page}
            totalPages={totalPages}
            items={trees.length}
            search={search}
            changePage={loadGalleryItems}
          />
        </div>
        <GalleryList
          loading={loading}
          trees={trees}
        />
        <Pagination
          loading={loading}
          page={page}
          totalPages={totalPages}
          items={trees.length}
          search={search}
          changePage={loadGalleryItems}
        />
      </div>
    </div>
  )
}
