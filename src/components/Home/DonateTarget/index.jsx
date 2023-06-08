import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import styles from './styles.scss'
import paypal from './paypal.png'
import patreon from './patreon.png'

export default ({ showWhy = false }) => {
  const [loading, setLoading] = useState(true)
  const [bill, setBill] = useState(0)
  const [donations, setDonations] = useState(0)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    axios.get('/api/bills')
      .then((response) => {
        const { billCents, donationsCents } = response.data
        setBill(billCents)
        setDonations(donationsCents)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    setPercent(Math.round((donations / bill) * 100))
  }, [bill, donations])

  function formatCents (cents) {
    const dollars = cents / 100
    return dollars.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }

  function getPercent () {
    return `${percent}%`
  }

  return (
    <div className={styles.donateContainer}>
      <div className={styles.donateTitle}>Donations Target</div>
      {loading
        ? <div className={styles.donateIntro}>Loading donations...</div>
        : <div className={styles.donateIntro}>{formatCents(donations)} of {formatCents(bill)} ({getPercent()})</div>}
      <div className={styles.bar}>
        <div
          className={styles.fill} style={{
            width: `${Math.min(percent, 100)}%`
          }}
        />
      </div>

      <div className={styles.donateButtons}>
        <a
          className='btn btn-patreon'
          target='_blank'
          rel='noopener noreferrer'
          href='https://patreon.com/ThePlumTree'
        >
          <img src={patreon} height='20' style={{ verticalAlign: 'middle' }} /> Patreon
        </a>
        <a
          className='btn btn-primary'
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
