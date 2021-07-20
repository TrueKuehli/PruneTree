import React from 'react'
import { Link } from 'react-router-dom'

export default ({ prevLink, prevText, nextLink, nextText }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      {
        prevLink &&
          <Link to={prevLink} className='btn btn-default'>
            <i className='icon-chevron-left' /> {prevText}
          </Link>
      }
      {
        nextLink &&
          <Link to={nextLink} className='btn btn-default'>
            {nextText} <i className='icon-chevron-right' />
          </Link>
      }
    </div>
  )
}
