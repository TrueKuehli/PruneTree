import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import styles from './styles.scss'
import auth from '../../common/js/auth'

export default () => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    // Close if clicked on outside of element
    function handleClickOutside (event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  function handleDropdownToggle () {
    setOpen(!open)
  }

  function handleLogout () {
    const session = auth.getSession()
    auth.clearToken()
    toast.success(`Cya later ${session.username}!`)
    setOpen(false)
  }

  return (
    <div ref={wrapperRef}>
      <div id='account-dropdown' className={styles.dropdownButton} onClick={handleDropdownToggle}>
        Account
        <i className={open ? `${styles.downArrow} ${styles.downArrowActive}` : styles.downArrow} />
      </div>
      <div className={open ? `${styles.menu} ${styles.menuActive}` : styles.menu}>
        {auth.getSession()
          ? (
            <ul>
              <li><Link to='/account' onClick={handleDropdownToggle}>Account Settings</Link></li>
              <li><Link id='account-logout' to='/' onClick={handleLogout}>Logout</Link></li>
            </ul>
            )
          : (
            <ul>
              <li><Link to='/login' onClick={handleDropdownToggle}>Login</Link></li>
              <li><Link to='/signup' onClick={handleDropdownToggle}>Create Account</Link></li>
            </ul>
            )}
      </div>
    </div>
  )
}
