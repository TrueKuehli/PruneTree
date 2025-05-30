import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';

import database from '../../common/scripts/database';
import {selectTrees, useAppDispatch, useAppSelector} from '../../redux/hooks';
import {loadUsersTree} from '../../redux/treeReducer';

import * as styles from './styles.scss';
import treeImg from '../../common/images/favicon.png';


type Props = {
  onItemClick: () => void
}


/**
 * The side navigation component.
 * @param onItemClick - Callback to close the side navigation.
 * @constructor
 */
export default function SideNav({onItemClick}: Props) {
  const trees = useAppSelector(selectTrees);
  const dispatch = useAppDispatch();

  useEffect(() => {
    database.getTrees()
      .then((response) => {
        dispatch(loadUsersTree(response));
      })
      .catch((err) => {
        toast.error(err?.message || 'Oops, we failed fetch your trees. Refresh the page to try again.',
          {autoClose: false, toastId: 'fetchTrees'});
      });
  }, [dispatch]);

  // Transform the git repo url to a url that can be used to open the repo in the browser.
  const repoUrl = (GIT_REPO_URL.startsWith('git@') ?
    GIT_REPO_URL.replace(':', '/').replace('git@', 'https://') :
    GIT_REPO_URL
  ).replace('.git', '');

  const commitUrl = `${repoUrl}/commit/${COMMIT_HASH}`;
  const shortCommitHash = COMMIT_HASH.substring(0, 7);

  return (
    <div className={styles.navWrapper}>
      <ul className={styles.navList}>
        <li><Link to="/" onClick={onItemClick}> Home </Link></li>
        <li><Link to="/guides" onClick={onItemClick}> Guides </Link></li>
        <li><Link to="/support" onClick={onItemClick}> Support </Link></li>
      </ul>

      <div className={styles.navTreesHeader}>Your Trees</div>

      {
        <ul className={[styles.navList, styles.lastNav].join(' ')}>
          <li><Link to='/trees/create' onClick={onItemClick}> Create New </Link></li>
          {trees.map((tree) => {
            const url = `/trees/${tree._id}`;
            return <li key={tree._id as number}><Link to={url} onClick={onItemClick}>
              <img src={treeImg} className={styles.treeLogo} alt={'Tree Logo'}/>
              {tree.title || 'Untitled Tree'}
            </Link></li>;
          })}
        </ul>
      }

      <div className={styles.navFooter}>
        Version <Link to={'/Version'} onClick={onItemClick}>{PACKAGE_VERSION}</Link> (
          <Link to={commitUrl} target='_blank' rel='noopener noreferrer'>{shortCommitHash}</Link>
        )
      </div>
    </div>
  );
}
