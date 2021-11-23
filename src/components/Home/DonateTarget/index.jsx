import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import styles from './styles.scss'

export default () => {
  const [bill, setBill] = useState(0)
  const [donations, setDonations] = useState(0)
  const [percent, setPercent] = useState(0)

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
      <div className={styles.donateTitle}>Donations Target ({getPercent()})</div>
      <div className={styles.bar}>
        <div
          className={styles.fill} style={{
            width: `${Math.min(percent, 100)}%`
          }}
        />
      </div>
      <div className={styles.donateIntro}>
        <p>The plum tree is free to use but not free to run. Please consider donating to help me out in keeping the project going.</p>
        <p>Last months bill was {formatCents(bill)}, donations this month are up to {formatCents(donations)}.</p>
      </div>
      <div className={styles.donateButtons}>
        <Link to='/donate'>More Info</Link>
        <a
          className='btn btn-primary'
          target='_blank'
          rel='noopener noreferrer'
          href='https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZXUTDCZXY7L28&source=url'
        >
          Donate Now
        </a>
      </div>
    </div>
  )
}
