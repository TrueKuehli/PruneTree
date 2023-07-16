import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './style.scss'
import paypal from './paypal.png'
import patreon from './patreon.png'

export default ({ showWhy = false }) => {
  const [loading, setLoading] = useState(true)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [bill, setBill] = useState({
    costs: { aws: 32014, atlas: 7718, total: 39732 },
    donations: { paypal: 6400, patreon: 4156, total: 10556 }
  })

  useEffect(() => {
    axios.get('https://donations.theplumtreeapp.com/api/bills')
      .then((response) => {
        const { data } = response
        console.log(data)
        setBill(data)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  function formatCents (cents) {
    const dollars = cents / 100
    return dollars.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }

  function patreonPercent () {
    if (bill.donations.total > bill.costs.total) {
      return Math.floor((bill.donations.patreon / bill.donations.total) * 100)
    }
    return Math.floor((bill.donations.patreon / bill.costs.total) * 100)
  }

  function paypalPercent () {
    if (bill.donations.total > bill.costs.total) {
      return Math.floor((bill.donations.paypal / bill.donations.total) * 100)
    }
    return Math.floor((bill.donations.paypal / bill.costs.total) * 100)
  }

  function totalPercent (overflow = false) {
    if (bill.donations.total > bill.costs.total && !overflow) {
      return 100
    }
    return Math.floor((bill.donations.total / bill.costs.total) * 100)
  }

  const Summary = () => (
    <>
      <div><span className='key patreon' /> Patreon {patreonPercent()}%</div>
      <div><span className='key paypal' /> PayPal {paypalPercent()}%</div>
    </>
  )

  return (
    <div className='donate-container'>
      <div className='donate-title'>Donations Target</div>
      {loading
        ? <div className='donate-intro'>Loading donations...</div>
        : <div className='donate-intro'>{formatCents(bill.donations.total)} of {formatCents(bill.costs.total)} ({totalPercent(true)}%)</div>}

      <div className={showBreakdown ? 'donation-progress breakdown' : 'donation-progress'}>
        {!loading &&
          <>
            <div className='donation-bar donation-total'>
              <div role='progressbar' className='donation-all' style={{ width: `${totalPercent()}%` }} />
            </div>
            <div className='donation-bar donation-breakdown'>
              <div role='progressbar' className='donation-patreon' style={{ width: `${patreonPercent()}%` }} />
              <div role='progressbar' className='donation-paypal' style={{ width: `${paypalPercent()}%` }} />
            </div>
          </>}

      </div>

      <div className='breakdown'>
        <div className='breakdown-toggle' onClick={() => setShowBreakdown(!showBreakdown)}>
          {showBreakdown ? 'Hide breakdown' : 'Show breakdown'}
        </div>
        <div className={showBreakdown ? 'active details' : 'details'}>
          {loading
            ? <div>Loading...</div>
            : <Summary />}
        </div>
      </div>

      <div className='donate-buttons'>
        <a
          className='btn btn-patreon'
          target='_blank'
          rel='noopener noreferrer'
          href='https://patreon.com/ThePlumTree'
        >
          <img src={patreon} height='20' style={{ verticalAlign: 'middle' }} /> Patreon
        </a>
        <a
          className='btn btn-paypal'
          target='_blank'
          rel='noopener noreferrer'
          href='https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZXUTDCZXY7L28&source=url'
        >
          <img src={paypal} height='20' style={{ verticalAlign: 'middle' }} /> PayPal
        </a>
        {showWhy && <Link to='/donate'>Why Donate?</Link>}
      </div>
    </div>
  )
}
