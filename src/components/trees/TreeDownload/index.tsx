import React, {useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import * as zip from '@zip.js/zip.js';

import database from '../../../common/scripts/database';


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
  function downloadTree() {
    setDownloading(true);

    // Get full tree data
    database.getTreeBundled(treeId)
      .then(async (bundle) => {
        const zipFileWriter = new zip.BlobWriter();
        const zipWriter = new zip.ZipWriter(zipFileWriter);

        // Add tree data, this ignores any file blobs!
        await zipWriter.add('bundle.json', new zip.TextReader(JSON.stringify(bundle)));

        // Add all blobs
        const promises = [];
        bundle.images.forEach((image) => {
          const name = image.cropped.type == 'image/png' ? `${image._id}.png` :
            (image.cropped.type == 'image/jpeg' ? `${image._id}.jpg` : `${image._id}`);

          promises.push(zipWriter.add(`original/${name}`, new zip.BlobReader(image.original)));
          promises.push(zipWriter.add(`cropped/${name}`, new zip.BlobReader(image.cropped)));
        });

        // Wait for all blobs to be added
        await Promise.all(promises);

        // Close the zip
        const zipFileBlob = await zipWriter.close();

        const filename = (bundle.tree.title || 'Untitled Tree')
          .slice(0, 32)
          .replace(/[^a-z0-9\-_]+/gi, '_')
          .toLowerCase() + '.zip';

        // Create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipFileBlob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // Clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        toast.success('Download started');
        setDownloading(false);
      });
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
