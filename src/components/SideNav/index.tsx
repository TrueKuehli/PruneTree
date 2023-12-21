import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';

import database from '../../common/scripts/database';
import {selectTrees, useAppDispatch, useAppSelector} from '../../redux/hooks';
import {loadUsersTree} from '../../redux/treeReducer';

import styles from './styles.scss';


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
          {autoClose: false});
      });
  }, [dispatch]);

  return (
    <div>
      <ul className={styles.navList}>
        <li><Link to='/' onClick={onItemClick}> Home </Link></li>
        <li><Link to='/guides' onClick={onItemClick}> Guides </Link></li>
      </ul>

      <div className={styles.navTreesHeader}>Your Trees</div>

      {
        <ul className={[styles.navList, styles.lastNav].join(' ')}>
          <li><Link to='/trees/create' onClick={onItemClick}> Create New </Link></li>
          {trees.map((tree) => {
            const url = `/trees/${tree._id}`;
            return <li key={tree._id as number}><Link to={url} onClick={onItemClick}> {tree.title} </Link></li>;
          })}
        </ul>
      }
    </div>
  );
}
