import React, { useRef, useEffect, useState } from 'react'
import axios from 'axios'
import DonateBar from '../DonateBar'
import SiteStats from '../Home/SiteStats'

export default () => {
  const [bill, setBill] = useState(0)
  const [donations, setDonations] = useState(0)
  const myRef = useRef(null)

  useEffect(() => {
    myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
    <div className='container' ref={myRef}>
      <h1>Why Donate?</h1>
      <p>Hi my name is Tobias.</p>
      <p>It has been fantastic creating a tool that so many people love and use
        to track their Sims legacies. However with this rise in popularity so do
        the monthly costs.
      </p>
      <p>The Plum Tree started out as personal project free to use for what I
        expected to only be a small number of users. Every donation goes a
        little way towards the monthly bills of storing terabytes of uploaded
        images, thousands of trees and handling the vast number of user traffic
        browsing the trees created.
      </p>
      <p>I humbly thank those of you that are able to contribute even just a little.</p>
      <DonateBar />
      <SiteStats />
      <h2>Last Months Costs</h2>
      <p>Last months bill was {formatCents(bill)}, donations this month are up to {formatCents(donations)} which means we've covered {getPercent()} of that.</p>
      <div className='alert alert-info'>
        <div className='alert-body'>
          Note the the stats above may take up to 24 hours to update and the donation total is that after currency conversions with fees deducted.
        </div>
      </div>
    </div>
  )
}
