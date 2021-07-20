import React from 'react'
import paypal from './paypal.png'

export default () => {
  return (
    <div className='container'>
      <h1>Donate</h1>
      <p>Thanks for the interest in helping support us. Click the button below to donate any amount you wish.</p>
      <a
        className='btn btn-lg btn-primary'
        target='_blank'
        rel='noopener noreferrer'
        href='https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZXUTDCZXY7L28&source=url'
      >
        Donate using <img src={paypal} height='30' style={{ verticalAlign: 'middle' }} />
      </a>
      <p>Since the Plum Tree is free to use but our server costs are not, every donation goes a little way towards our monthly bills.</p>
      <p>We humbly thank those of you that are able to contribute.</p>
    </div>
  )
}
