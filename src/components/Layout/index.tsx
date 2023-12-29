import React, {useEffect, useState} from 'react';
import {Route, Link, Routes} from 'react-router-dom';

import Home from '../Home';
import Guides from '../Guides';
import TreeDetails from '../trees/TreeDetails';
import TreeDownload from '../trees/TreeDownload';
import TreeEditor from '../trees/TreeEditor';
import TreePeople from '../trees/TreePeople';
import PersonEditor from '../trees/PersonEditor';
import PersonLinker from '../trees/PersonLinker';
import SideNav from '../SideNav';
import Support from '../Support';
import Version from '../Version';
import NotFound from '../NotFound';

import styles from './styles.scss';
import logo from '../../common/images/logo.png';
import {persistStorage} from '../../common/scripts/utils';


/**
 * Definitions of the main application routes and the components that they render.
 */
export default function AppRoutes() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Try to persist browser storage
  useEffect(persistStorage, []);

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
            <img src={logo} className={styles.headerLogo} height='40' width='40' alt={'Header Logo'}/>
            <h1 className='hidden-xs-down'><Link to='/'> The Prune Tree </Link></h1>
          </div>
        </header>

        <div className={styles.body}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/guides/*' element={<Guides />} />
            <Route path='/trees/create' element={<TreeDetails />} />
            <Route path='/trees/:treeId' element={<TreeEditor />} />
            <Route path='/trees/:treeId/download' element={<TreeDownload />} />
            <Route path='/trees/:treeId/details' element={<TreeDetails />} />
            <Route path='/trees/:treeId/people' element={<TreePeople />} />
            <Route path='/trees/:treeId/people/add' element={<PersonEditor />} />
            <Route path='/trees/:treeId/people/:personId' element={<PersonEditor />} />
            <Route path='/trees/:treeId/people/:personId/link' element={<PersonLinker />} />
            <Route path='/support' element={<Support />} />
            <Route path='/version' element={<Version />} />
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
          <SideNav onItemClick={() => setMenuOpen(false)} />
        </nav>
        <div className={menuOpen ? `${styles.navMask} ${styles.navMaskActiveMenu}` : styles.navMask}
             onClick={() => setMenuOpen(false)} />
      </div>
    </div>
  );
}
