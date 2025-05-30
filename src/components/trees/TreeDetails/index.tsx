import React, {useState, useEffect, useRef} from 'react';
import {Link, useBeforeUnload, useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';

import {Tree} from '../../../common/scripts/types';
import database from '../../../common/scripts/database';
import {parseID} from '../../../common/scripts/utils';
import {importBackup} from '../../../common/scripts/exchange';
import {getImageUri, ImageURL} from '../../../common/scripts/dataUrl';
import {useAppDispatch} from '../../../redux/hooks';
import {addTree, updateTree} from '../../../redux/treeReducer';
import Loading from '../../Loading';
import RichEditor from '../../RichEditor';
import ImageManager from '../ImageManager';

import * as styles from './styles.scss';


/**
 * Renders the details page for a tree, allowing the creation and editing of a tree.
 */
export default function TreeDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();

  const backupFileRef = useRef<HTMLInputElement>(null);

  const {treeId} = params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState<number>(null);
  const [coverUri, setCoverUri] = useState<ImageURL>(null);
  const [orphanedCovers, setOrphanedCovers] = useState<number[]>([]);
  const [loading, setLoading] = useState(!!treeId);

  // Ref is available in cleanup, state is not
  const createdCovers = useRef<number[]>([]);

  useEffect(() => {
    if (treeId) {
      database.getTree(treeId)
        .then((response) => {
          const {title, description, cover} = response;
          setTitle(title);
          setDescription(description);
          if (cover) {
            getImageUri(cover).then((uri) => {
              setCoverUri(uri);
              setCover(cover);
              setLoading(false);
            });
          } else {
            setCover(null);
            setLoading(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error(
            err?.message || 'Failed to get tree info',
            {autoClose: false, toastId: `tree-load-fail-${treeId}`},
          );
        });
    }
  }, [treeId]);

  // Delete all created images when navigating away from the page
  useBeforeUnload(
    React.useCallback(() => {
      deleteCreatedImages();
    }, []),
  );

  // Delete all created images when unmounting the component
  useEffect(() => {
    return () => {
      deleteCreatedImages();
    };
  }, []);

  /**
   * Updates the cover image of the current tree.
   * @param imageId The new image ID to set as the cover image.
   */
  function updateCover(imageId: number) {
    // Set previous cover as orphaned, such that it can be deleted on submit
    if (cover && !orphanedCovers.includes(cover) && imageId !== cover) {
      setOrphanedCovers([...orphanedCovers, cover]);
    }

    // Add new cover to created covers, such that it can be deleted on cancel
    if (imageId && !createdCovers.current.includes(imageId) && imageId !== cover) {
      createdCovers.current = [...createdCovers.current, imageId];
    }

    if (imageId === null) {
      setCover(null);
      setCoverUri(null);
    } else {
      getImageUri(imageId).then((uri) => {
        setCoverUri(uri);
        setCover(imageId);
      });
    }
  }

  /**
   * Deletes all created images on cancel.
   */
  function deleteCreatedImages() {
    if (createdCovers.current.length) {
      database.deleteImages(createdCovers.current)
        .catch((err) => {
          toast.error(err?.message || 'Failed to delete created images', {autoClose: false});
        });
    }
  }

  /**
   * Updates the tree details or creates a new tree of form submit.
   * @param event The form submit event.
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const tree = {title, description, cover};
    createdCovers.current = []; // Clear created covers, as orphanedCovers handles cleanup

    if (treeId) {
      _updateTree(treeId, tree);
    } else {
      _createTree(tree);
    }
  }

  /**
   * Adds a tree to the side nav.
   * @param tree The tree to add to the side nav.
   */
  function _createTree(tree: Partial<Tree>) {
    database.createTree(tree)
      .then(async (response) => {
        if (orphanedCovers.length) {
          await database.deleteImages(orphanedCovers);
        }

        const tree = response;
        const treeId = response._id as number;
        toast.success('Tree created');
        navigate(`/trees/${treeId}`);
        // Update the side nav
        dispatch(addTree(tree));
      })
      .catch((err) => {
        toast.error(err?.message || 'Unknown error occurred creating tree', {autoClose: false});
      });
  }

  /**
   * Opens the file selector to select a backup zip file.
   */
  function selectBackup(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    ev.preventDefault();
    backupFileRef.current.click();
  }

  /**
   * Imports a tree from a backup zip file.
   */
  async function importTree(ev: React.ChangeEvent<HTMLInputElement>) {
    ev.preventDefault();
    setLoading(true);

    // Take care of orphaned images
    if (cover && !orphanedCovers.includes(cover)) {
      await database.deleteImages([...orphanedCovers, cover]);
    } else if (orphanedCovers.length) {
      await database.deleteImages(orphanedCovers);
    }

    // Read ZIP file
    const file = backupFileRef.current.files[0];
    let readTree: Tree;
    try {
      readTree = await importBackup(file);
    } catch (e) {
      toast.error(e?.message || 'An error occurred while importing your backup', {autoClose: false});
      setLoading(false);
      return;
    }

    if (!readTree) {
      setLoading(false);
      return;
    }

    toast.success('Tree imported');
    navigate(`/trees/${readTree._id}`);

    // Update the side nav
    dispatch(addTree(readTree));

    setLoading(false);
  }

  /**
   * Updates the tree details in the side nav.
   * @param treeId The ID of the tree to update.
   * @param tree The tree details to update.
   */
  function _updateTree(treeId: number | string, tree: Partial<Tree>) {
    const parsedTreeId = parseID(treeId);
    database.updateTree(treeId, tree)
      .then(async (tree) => {
        if (orphanedCovers.length) {
          await database.deleteImages(orphanedCovers);
        }

        toast.success('Tree details updated');
        navigate(`/trees/${treeId}`);

        // Update the side nav
        dispatch(updateTree(Object.assign(tree, {_id: parsedTreeId})));
      })
      .catch((err) => {
        toast.error(err?.message || 'Unknown error occurred updating tree details', {autoClose: false});
      });
  }

  const cancelLink = treeId ? `/trees/${treeId}` : '/';
  const cancelClass = [styles.formBtn, 'btn', 'btn-default'].join(' ');
  const submitClass = [styles.formBtn, 'btn', 'btn-primary'].join(' ');

  const imagePreview = cover ?
    (<div className={styles.coverImage} style={{backgroundImage: `url(${coverUri.url})`}} />) :
    (<div className={styles.coverImage}>No cover image currently set.</div>);

  return (
    loading ? <Loading message='Loading...' /> :

    <div className='container'>
      {treeId ? <h1>Update Tree Details</h1> :

        <>
          <input name='file' type='file' id='file' accept='.zip,application/zip'
                 onChange={importTree} ref={backupFileRef} style={{display: 'none'}}/>
          <div className={styles.createHeader}>
            <h1>Create a New Tree</h1>
            <button id='tree-details-submit' type='button' className={submitClass} onClick={selectBackup}>
              Import a Backup
            </button>
          </div>
        </>

      }

      <ImageManager
        image={cover}
        imagePreview={imagePreview}
        onImageChange={updateCover}
        aspect={15 / 8}
      />

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label id='tree-title-label' htmlFor='tree-title-input'>Title</label>
          <input id='tree-title-input' className='form-control' type='text' name='title' value={title}
                 aria-labelledby={'tree-title-label'}
                 onChange={(ev) => setTitle(ev.target.value)} />
        </div>
        <RichEditor initialHtml={description} onUpdate={setDescription} />
        <Link className={cancelClass} to={cancelLink}>Cancel</Link>
        <button id='tree-details-submit' type='submit' className={submitClass}>
          {treeId ? 'Update Tree Details' : 'Create Tree'}
        </button>
      </form>
    </div>
  );
}
