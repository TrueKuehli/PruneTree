import React, { useState, useEffect } from 'react'
import { Route, Link, Switch, useLocation } from 'react-router-dom'

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
import TreeEditor from '../trees/TreeEditor'
import TreePeople from '../trees/TreePeople'
import PersonEditor from '../trees/PersonEditor'
import PersonLinker from '../trees/PersonLinker'
import AccountDropdown from '../AccountDropdown'
import SideNav from '../../containers/SideNav'
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
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/guides' component={Guides} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/donate' component={Donate} />
            <Route exact path='/gallery' component={Gallery} />
            <Route exact path='/account' component={Account} />
            <Route exact path='/support' component={Support} />
            <Route exact path='/forgot-password' component={ForgotPassword} />
            <Route exact path='/reset-password' component={ResetPassword} />
            <Route exact path='/forgot-username' component={ForgotUsername} />
            <Route exact path='/trees/create' component={TreeDetails} />
            <Route exact path='/trees/:treeId' component={TreeEditor} />
            <Route exact path='/trees/:treeId/publish' component={TreePublish} />
            <Route exact path='/trees/:treeId/details' component={TreeDetails} />
            <Route exact path='/trees/:treeId/people' component={TreePeople} />
            <Route exact path='/trees/:treeId/people/add' component={PersonEditor} />
            <Route exact path='/trees/:treeId/people/:personId' component={PersonEditor} />
            <Route exact path='/trees/:treeId/people/:personId/link' component={PersonLinker} />
            <Route component={NotFound} />
          </Switch>
        </div>

        <nav className={styles.nav}>
          <div className={styles.closeRow}>
            <div className={styles.closeButton} onClick={() => setMenuOpen(false)}>
              <span>Close</span>
              <i className={styles.close} />
            </div>
          </div>
          <SideNav onItemClick={() => setMenuOpen(false)} />
        </nav>
        <div className={menuOpen ? `${styles.navMask} ${styles.navMaskActiveMenu}` : styles.navMask} onClick={() => setMenuOpen(false)} />
      </div>
    </div>
  )
}
