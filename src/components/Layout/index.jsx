import React, { useState, useEffect } from 'react'
import { Route, Link, Routes, useLocation } from 'react-router-dom'

import styles from './styles.scss'
import logo from '../../common/images/logo.png'
import { sendGoogleAnalyticsPageView } from '../../common/js/utils'

import Home from '../Home'
import Guides from '../Guides'
import Donate from '../Donate'
import Gallery from '../Gallery'
import Signup from '../Signup'
import Login from '../../containers/Login'
import Account from '../Account'
import ForgotPassword from '../ForgotPassword'
import ResetPassword from '../ResetPassword'
import ForgotUsername from '../ForgotUsername'
import Support from '../Support'
import TreeDetails from '../../containers/TreeDetails'
import TreePublish from '../trees/TreePublish'
import TreeDownload from '../trees/TreeDownload'
import TreeEditor from '../trees/TreeEditor'
import TreePeople from '../trees/TreePeople'
import PersonEditor from '../trees/PersonEditor'
import PersonLinker from '../trees/PersonLinker'
import AccountDropdown from '../AccountDropdown'
import SideNav from '../../containers/SideNav'
import Version from '../Version'
import Sunset from '../Sunset'
import NotFound from '../NotFound'

export default () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    sendGoogleAnalyticsPageView(location.pathname + location.search)
  }, [location])

  return (
    <div className={styles.root}>
      <div className={menuOpen ? `${styles.container} ${styles.containerActiveMenu}` : styles.container}>
        <header className={styles.header}>
          <div className={styles.menuButton} onClick={() => setMenuOpen(true)}>
            <i className={menuOpen ? `${styles.hamburger} ${styles.hamburgerActive}` : styles.hamburger}>
              <div />
              <div />
              <div />
            </i>
            Menu
          </div>

          <div className={styles.brand}>
            <img src={logo} className={styles.headerLogo} height='40' width='40' />
            <h1 className='hidden-xs-down'><Link to='/'> The Plum Tree </Link></h1>
          </div>

          <AccountDropdown />
        </header>

        <div className={styles.body}>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route path='/guides/*' element={<Guides />} />
            <Route exact path='/signup' element={<Signup />} />
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/donate' element={<Donate />} />
            <Route exact path='/gallery' element={<Gallery />} />
            <Route exact path='/account' element={<Account />} />
            <Route exact path='/support' element={<Support />} />
            <Route exact path='/forgot-password' element={<ForgotPassword />} />
            <Route exact path='/reset-password' element={<ResetPassword />} />
            <Route exact path='/forgot-username' element={<ForgotUsername />} />
            <Route exact path='/trees/create' element={<TreeDetails />} />
            <Route exact path='/trees/:treeId' element={<TreeEditor />} />
            <Route exact path='/trees/:treeId/publish' element={<TreePublish />} />
            <Route exact path='/trees/:treeId/download' element={<TreeDownload />} />
            <Route exact path='/trees/:treeId/details' element={<TreeDetails />} />
            <Route exact path='/trees/:treeId/people' element={<TreePeople />} />
            <Route exact path='/trees/:treeId/people/add' element={<PersonEditor />} />
            <Route exact path='/trees/:treeId/people/:personId' element={<PersonEditor />} />
            <Route exact path='/trees/:treeId/people/:personId/link' element={<PersonLinker />} />
            <Route exact path='/version' element={<Version />} />
            <Route exact path='/sunset' element={<Sunset />} />
            <Route path='/*' element={<NotFound />} />
          </Routes>
        </div>

        <nav className={styles.nav}>
          <div className={styles.closeRow}>
            <div className={styles.closeButton} onClick={() => setMenuOpen(false)}>
              <span>Close</span>
              <i className={styles.close} />
            </div>
          </div>
          <Link to='/sunset' className={styles.sunsetAlert} onClick={() => setMenuOpen(false)}>The Plum Tree App will be shutting down. Click to find out more.</Link>
          <SideNav onItemClick={() => setMenuOpen(false)} />
        </nav>
        <div className={menuOpen ? `${styles.navMask} ${styles.navMaskActiveMenu}` : styles.navMask} onClick={() => setMenuOpen(false)} />
      </div>
    </div>
  )
}
