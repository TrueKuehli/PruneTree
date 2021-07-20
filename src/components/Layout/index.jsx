import React, { Component } from 'react'
import { Route, Link, Switch } from 'react-router-dom'

import styles from './styles.scss'
import logo from '../../common/images/logo.png'

import Home from '../Home'
import Guides from '../Guides'
import Donate from '../Donate'
import DevsWanted from '../DevsWanted'
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

class Layout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      menuOpen: false // side nav state
    }

    this.handleOpenMenu = this.handleOpenMenu.bind(this)
    this.handleCloseMenu = this.handleCloseMenu.bind(this)
  }

  handleOpenMenu () {
    this._setMenuOpenState(true)
  }

  handleCloseMenu () {
    this._setMenuOpenState(false)
  }

  _setMenuOpenState (open) {
    const newState = {}
    newState.menuOpen = open
    this.setState(newState)
  }

  render () {
    const menuOpen = this.state.menuOpen
    const containerClassNames = [styles.container]
    const maskClassNames = [styles.navMask]
    const burgerClassNames = [styles.hamburger]

    if (menuOpen) {
      containerClassNames.push(styles.containerActiveMenu)
      maskClassNames.push(styles.navMaskActiveMenu)
      burgerClassNames.push(styles.hamburgerActive)
    }

    return (
      <div className={styles.root}>

        <div className={containerClassNames.join(' ')}>
          <header className={styles.header}>
            <div className={styles.menuButton} onClick={this.handleOpenMenu}>
              <i className={burgerClassNames.join(' ')}>
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
              <Route exact path='/devs-wanted' component={DevsWanted} />
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
              <div className={styles.closeButton} onClick={this.handleCloseMenu}>
                <span>Close</span>
                <i className={styles.close} />
              </div>
            </div>
            <SideNav onItemClick={this.handleCloseMenu} />
          </nav>
          <div className={maskClassNames.join(' ')} onClick={this.handleCloseMenu} />
        </div>
      </div>
    )
  }
};

export default Layout
