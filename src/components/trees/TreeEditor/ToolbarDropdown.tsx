import React, {useState, useEffect, useRef} from 'react';

import {Link} from 'react-router-dom';

import styles from './styles.scss';


type MenuItem = {
  id: string,
  label: string,
  link?: string,
  onClick?: () => void,
}

type Props = {
  id: string,
  label: string,
  items: MenuItem[],
}


/**
 * A toolbar dropdown menu for the tree editor.
 * @param id The id of the dropdown.
 * @param label The label of the dropdown.
 * @param items The menu items.
 */
export default function ToolbarDropdown({id, label, items}: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /**
     * Close if clicked outside the dropdown.
     * @param event The click event.
     */
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  /**
   * Handles a menu item click.
   * @param menuItem The menu item that was clicked.
   */
  function handleItemClick(menuItem: MenuItem) {
    menuItem.onClick && menuItem.onClick();
    setOpen(false);
  }

  /**
   * Toggle the dropdown menu.
   */
  function handleDropdownToggle() {
    setOpen(!open);
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
                {menuItem.link ?
                  (
                    <Link to={menuItem.link} onClick={() => handleItemClick(menuItem)}>{menuItem.label}</Link>
                    ) :
                  (
                    <div onClick={() => handleItemClick(menuItem)}>{menuItem.label}</div>
                    )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
