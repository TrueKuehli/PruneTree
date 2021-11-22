import React, { useEffect, useState } from 'react'
import axios from 'axios'
import paypal from './paypal.png'

export default () => {
  const [bill, setBill] = useState(0)
  const [donations, setDonations] = useState(0)

  useEffect(() => {
    axios.get('/api/bills')
      .then((response) => {
        const { billCents, donationsCents } = response.data
        setBill(billCents)
        setDonations(donationsCents)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  function formatCents (cents) {
    const dollars = cents / 100
    return dollars.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }

  function getPercent () {
    return `${Math.round((donations / bill) * 100)}%`
  }

  return (
    <div className='container'>
      <h1>Donate</h1>
      <p>It has been fantastic creating a tool that so many people love and use to track their Sims legacies. However with this rise in popularity so do the monthly costs.</p>
      <p>The Plum Tree is a personal project that is free to use, so not a great business model.</p>
      <p>Every donation goes a little way towards the monthly bills I have to pay. I humbly thank those of you that are able to contribute even just a little.</p>
      <a
        className='btn btn-lg btn-primary'
        target='_blank'
        rel='noopener noreferrer'
        href='https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZXUTDCZXY7L28&source=url'
      >
        Donate using <img src={paypal} height='30' style={{ verticalAlign: 'middle' }} />
      </a>
      <h2>Last Months Costs</h2>
      <p>Last months bill was {formatCents(bill)}, donations this month are up to {formatCents(donations)} which means we've covered {getPercent()} of that.</p>
      <p>Note the the stats above may take up to 24 hours to update and the donation total is that after currency conversions with fees deducted.</p>
    </div>
  )
}
