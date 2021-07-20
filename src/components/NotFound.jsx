import React from 'react'
import image from '../common/images/tragic-clown.jpg'
import { Link } from 'react-router-dom'

export default () => {
  return (
    <div className='container'>
      <h1 className='sr-only'>Not Found</h1>
      <p style={{ textAlign: 'center' }}>Looks like this pages does not exist. <Link to='/'>Return home?</Link></p>
      <img src={image} width='100%' />
    </div>
  )
}
