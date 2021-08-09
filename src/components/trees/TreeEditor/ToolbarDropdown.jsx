import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'

export default ({ id, label, items }) => {
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

  function handleItemClick (menuItem) {
    menuItem.onClick && menuItem.onClick()
    setOpen(false)
  }

  function handleDropdownToggle () {
    setOpen(!open)
  }

  return (
    <div className={styles.toolbarDropdown} ref={wrapperRef}>
      <div id={id} className={styles.toolbarItem} onClick={handleDropdownToggle}>
        {label} <i className={open ? `${styles.downArrow} ${styles.downArrowActive}` : styles.downArrow} />
      </div>
      <div className={open ? `${styles.menu} ${styles.menuActive}` : styles.menu}>
        <ul>
          {items.map((menuItem, index) => {
            return (
              <li id={menuItem.id} key={index}>
                {menuItem.link
                  ? (
                    <Link to={menuItem.link} onClick={() => handleItemClick(menuItem)}>{menuItem.label}</Link>
                    )
                  : (
                    <div onClick={() => handleItemClick(menuItem)}>{menuItem.label}</div>
                    )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
