import React from 'react'
import { Link } from 'react-router-dom'

export default () => {
  return (
    <div style={{ paddingTop: 15 }}>
      <Link to='/guides' className='btn btn-default'><i className='icon-list' /> Guides Index</Link>
    </div>
  )
}
