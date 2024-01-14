import React, {useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';

import {exportBackup} from '../../../common/scripts/exchange';


/**
 * Download page of a tree.
 */
export default function TreeDownload() {
  const params = useParams();
  const {treeId} = params;
  const [downloading, setDownloading] = useState(false);

  /**
   * Compress and download the tree as a zip file.
   */
  async function downloadTree() {
    setDownloading(true);

    try {
      await exportBackup(treeId);
    } catch (e) {
      toast.error(`An error occurred while preparing your download: ${e.message}`, {autoClose: false});
    }

    setDownloading(false);
  }

  return (
    <div className='container'>
      <h1>Back-Up Your Tree</h1>
      <p>
        Downloading your tree lets you keep an offline backup of your tree. The download will be
        a <code>.zip</code> file containing your tree data including all images. You can then later import this file
        into the app to restore your tree.
      </p>
      <Link className='btn btn-default' to={`/trees/${treeId}`}>Cancel</Link>
      <button
        type='submit'
        className='btn btn-primary'
        disabled={downloading}
        onClick={downloadTree}
      >
        {downloading ? 'Preparing your download' : 'Download'}
      </button>
    </div>
  );
}
