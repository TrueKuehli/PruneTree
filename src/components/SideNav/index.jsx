import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import styles from './styles.scss'
import auth from '../../common/js/auth'
import database from "../../database/api";
import {toast} from "react-toastify";
import get from "lodash.get";

export default ({ loadUsersTree, trees, onItemClick }) => {
  useEffect(() => {
    database.getTrees()
      .then((response) => {
        loadUsersTree(response.data)
      })
      .catch((error) => {
        toast.error(get(error, 'message', 'Oops, we failed fetch your trees. Refresh the page to try again.'), { autoClose: false })
      })
  }, [])

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
            const url = `/trees/${tree._id}`
            return <li key={tree._id}><Link to={url} onClick={onItemClick}> {tree.title} </Link></li>
          })}
        </ul>
      }
    </div>
  )
}
