import React, {useState, useEffect} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';

import database from '../../../common/scripts/database';
import {getImageUri} from '../../../common/scripts/dataUrl';
import Loading from '../../Loading';
import RichEditor from '../../RichEditor';
import ImageManager from '../ImageManager';

import styles from './styles.scss';
import {useAppDispatch} from '../../../redux/hooks';
import {Tree} from '../../../common/scripts/types';
import {addTree, updateTree} from '../../../redux/treeReducer';
import {parseID} from '../../../common/scripts/utils';


/**
 * Renders the details page for a tree, allowing the creation and editing of a tree.
 */
export default function TreeDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();

  const {treeId} = params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState(null);
  const [coverUri, setCoverUri] = useState(null);
  const [loading, setLoading] = useState(!!treeId);


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
          toast.error(err?.message || 'Failed to get tree info', {autoClose: false});
        });
    }
  }, [treeId]);

  /**
   * Updates the cover image of the current tree.
   * @param imageId The new image ID to set as the cover image.
   */
  function updateCover(imageId: number) {
    getImageUri(imageId).then((uri) => {
      setCoverUri(uri);
      setCover(imageId);
    });
  }

  /**
   * Updates the tree details or creates a new tree of form submit.
   * @param event The form submit event.
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const tree = {title, description, cover};

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
      .then((response) => {
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
   * Updates the tree details in the side nav.
   * @param treeId The ID of the tree to update.
   * @param tree The tree details to update.
   */
  function _updateTree(treeId: number | string, tree: Partial<Tree>) {
    const parsedTreeId = parseID(treeId);
    database.updateTree(treeId, tree)
      .then((tree) => {
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
      <h1>{treeId ? 'Update Tree Details' : 'Create a New Tree'}</h1>

      <ImageManager
        image={cover}
        imagePreview={imagePreview}
        onImageChange={updateCover}
        aspect={15 / 8}
      />

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input id='tree-title-input' className='form-control' type='text' name='title' value={title}
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
