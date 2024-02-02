import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';

import {Tree} from '../../../common/scripts/types';
import database from '../../../common/scripts/database';
import ToolbarDropdown from './ToolbarDropdown';

import styles from './styles.scss';


type Props = {
  tree: Tree,
  setPreviewMode: (preview?: boolean) => void,
  saveTree: (tree: Tree, alertSuccess?: boolean) => void
}


/**
 * The tree editor toolbar component.
 * @param tree The tree being edited.
 * @param onPreviewModeChange Callback for when the preview mode is toggled.
 * @param onSaveTree Callback for when the tree is saved.
 */
export default function Toolbar({tree, setPreviewMode: onPreviewModeChange, saveTree: onSaveTree}: Props) {
  const [previewMode, setPreviewMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    closeMenus();

    // Close all toolbar menus when window is resized. Prevents switching to mobile view and back with
    //   unexpected open menus.
    window.addEventListener('resize', closeMenus);

    return () => {
      window.removeEventListener('resize', closeMenus);
    };
  }, []);

  useEffect(() => {
    onPreviewModeChange && onPreviewModeChange(previewMode);
  }, [previewMode]);

  /**
   * Toggle the preview mode.
   */
  function handleTogglePreview() {
    setPreviewMode(!previewMode);
  }

  /**
   * Close all menus.
   */
  function closeMenus() {
    setMobileMenuOpen(false);
  }

  /**
   * Save the tree to the database.
   */
  function saveTree() {
    closeMenus();
    onSaveTree && onSaveTree(tree, true);
  }

  /**
   * Delete the tree from the database.
   */
  function deleteTree() {
    closeMenus();

    const deleteConfirmed = confirm('Are you sure you want to delete this tree? ' +
                                            'This will also delete all people and images in the tree!');

    if (deleteConfirmed) {
      database.deleteTree(tree?._id as number)
        .then(() => {
          toast.success('Tree deleted');
          // Quickest way to go to homepage and reload trees for side nav is to simply reload the page and
          //   going to homepage.
          window.location.href = '/';
        })
        .catch((err) => {
          toast.error(err?.message || 'Failed to delete your tree', {autoClose: false});
        });
    }
  }

  const burgerClassNames = [styles.hamburger];
  const mobileMenuClassNames = [styles.menuMobile];

  if (mobileMenuOpen) {
    burgerClassNames.push(styles.hamburgerActive);
    mobileMenuClassNames.push(styles.menuMobileActive);
  }

  const ACTION_MENU_ITEMS = [{
    id: 'actions-dropdown-save',
    label: 'Save Tree',
    onClick: saveTree,
  }, {
    id: 'actions-dropdown-delete',
    label: 'Delete Tree',
    onClick: deleteTree,
  }, {
    id: 'download-tree',
    label: 'Download Tree',
    onClick: closeMenus,
    link: `/trees/${tree?._id}/download`,
  }];

  const EDIT_MENU_ITEMS = [{
    id: 'edit-dropdown-tree-details',
    label: 'Tree Details',
    onClick: closeMenus,
    link: `/trees/${tree?._id}/details`,
  }, {
    id: 'edit-dropdown-people',
    label: 'People in Tree',
    onClick: closeMenus,
    link: `/trees/${tree?._id}/people`,
  }];

  return (
    <div>
      {/* Desktop Menu */}
      <div className='hidden-xs-down'>
        <div className={styles.toolbar}>
          <span className={styles.toolbarTitle}>Tree Editor</span>
          <ToolbarDropdown
            id='actions-dropdown'
            label='Actions'
            items={ACTION_MENU_ITEMS}
          />
          <ToolbarDropdown
            id='edit-dropdown'
            label='Edit'
            items={EDIT_MENU_ITEMS}
          />
          <input type='checkbox' checked={previewMode} onChange={handleTogglePreview}
                 aria-labelledby='preview-mode-label'/>
          <label className={[styles.toolbarItem, 'checkbox'].join(' ')} onClick={handleTogglePreview}
                 id='preview-mode-label'>
            <span /> Preview
          </label>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className='hidden-sm-up'>
        <div className={styles.toolbarMobile} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span className={styles.toolbarTitle}>Tree Editor</span>

          <div className={styles.menuButton}>
            <i className={burgerClassNames.join(' ')}>
              <div />
              <div />
              <div />
            </i>
          </div>
        </div>

        <div className={mobileMenuClassNames.join(' ')}>
          <ul>
            <div className={styles.mobileMenuHeading}>Actions</div>
            {ACTION_MENU_ITEMS.map((menuItem, index) => {
              return (
                <li key={index}>
                  {menuItem.link ?
                    (
                      <Link to={menuItem.link} onClick={() => menuItem.onClick()}>{menuItem.label}</Link>
                      ) :
                    (
                      <div onClick={() => menuItem.onClick()}>{menuItem.label}</div>
                      )}
                </li>
              );
            })}
            <div className={styles.mobileMenuHeading}>Edit</div>
            {EDIT_MENU_ITEMS.map((menuItem, index) => {
              return (
                <li key={index}>
                  {menuItem.link ?
                    (
                      <Link to={menuItem.link} onClick={() => menuItem.onClick()}>{menuItem.label}</Link>
                      ) :
                    (
                      <div onClick={() => menuItem.onClick()}>{menuItem.label}</div>
                      )}
                </li>
              );
            })}
            <div className={styles.mobileMenuHeading}>Preview</div>
            <input type='checkbox' checked={previewMode} onChange={handleTogglePreview} />
            <label className={[styles.toolbarItem, 'checkbox'].join(' ')} onClick={handleTogglePreview}>
              <span /> Preview
            </label>
          </ul>
        </div>
      </div>
    </div>
  );
}
