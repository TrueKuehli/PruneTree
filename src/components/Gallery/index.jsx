import React, { Component } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import querystring from 'querystring'
import get from 'lodash.get'

import Pagination from './Pagination'
import GalleryList from './GalleryList'
import styles from './styles.scss'

class Gallery extends Component {
  constructor (props) {
    super(props)

    this.state = {
      trees: [],
      page: 1,
      loading: true,
      totalPages: null,
      search: ''
    }

    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.loadGalleryItems = this.loadGalleryItems.bind(this)
  }

  componentDidMount () {
    let urlParamsString = get(this, 'props.location.search', '')
    if (urlParamsString.charAt(0) === '?') {
      urlParamsString = urlParamsString.substr(1)
    }

    const urlParams = querystring.parse(urlParamsString)
    const search = urlParams.search || ''

    this.setState({
      search
    }, this.loadGalleryItems)
  }

  /**
   * Called when we load the view (componentDidMount) or change page in the
   * gallery.
   * @return {void}
   */
  loadGalleryItems (page) {
    // if we didn't load the page use the page URL query parameter or default to
    // page 1
    if (!page) {
      let urlParamsString = get(this, 'props.location.search', '')
      if (urlParamsString.charAt(0) === '?') {
        urlParamsString = urlParamsString.substr(1)
      }

      const urlParams = querystring.parse(urlParamsString)

      page = parseInt(urlParams.page, 10) || 1
    }

    this.setState({
      trees: [],
      page,
      loading: true,
      totalPages: 0 // we don't know the total pages at this point
    })

    const search = this.state.search

    axios.get(`/api/published?page[number]=${page}&search=${search}`)
      .then((response) => {
        this.setState({
          page,
          totalPages: get(response, 'data.meta.totalPages', null),
          trees: get(response, 'data.data', []),
          loading: false
        })
      })
      .catch((error) => {
        this.setState({
          page,
          trees: [],
          loading: false
        })
        toast.error(get(error, 'response.data.errors[0].detail', 'Error when loading gallery trees'), { autoClose: false })
      })
  }

  handleSearchSubmit (event) {
    event.preventDefault()

    if (this.state.search.trim().length > 1) {
      this.props.history.push({
        pathname: '/gallery',
        search: `?page=1&search=${this.state.search}`
      })
    } else {
      this.props.history.push({
        pathname: '/gallery',
        search: '?page=1'
      })
    }

    this.loadGalleryItems(1)
  }

  handleSearchChange (event) {
    const newState = {}
    newState[event.target.name] = event.target.value
    this.setState(newState)
  }

  render () {
    return (
      <div>
        <div className={styles.headerMask} />
        <div className='container'>
          <div className={styles.galleryHead}>
            <h1 className={styles.galleryTitle}>Gallery</h1>
            <form onSubmit={this.handleSearchSubmit}>
              <div className='input-group' styles='max-wid'>
                <div className='form-group'>
                  <label className='sr-only'>Search</label>
                  <input className='form-control' type='text' name='search' placeholder='Search' value={this.state.search} onChange={this.handleSearchChange} />
                </div>
                <button type='submit' className='btn btn-primary'>Search</button>
              </div>
            </form>
            <Pagination
              loading={this.state.loading}
              page={this.state.page}
              totalPages={this.state.totalPages}
              items={this.state.trees.length}
              search={this.state.search}
              changePage={this.loadGalleryItems}
            />
          </div>
          <GalleryList
            loading={this.state.loading}
            trees={this.state.trees}
          />
          <Pagination
            loading={this.state.loading}
            page={this.state.page}
            totalPages={this.state.totalPages}
            items={this.state.trees.length}
            search={this.state.search}
            changePage={this.loadGalleryItems}
          />
        </div>
      </div>
    )
  }
};

export default Gallery
