import React, { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import auth from '../../../common/js/auth'

export default () => {
  const params = useParams()
  const { treeId } = params
  const [downloading, setDownloading] = useState(false)

  function downloadTree () {
    const authToken = auth.getToken()
    if (!authToken) {
      return toast.error('Looks like you\'re not logged in', { autoClose: false })
    }

    setDownloading(true)
    axios.get(`/api/trees/${treeId}/download`, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
      .then((response) => {
        console.log(response.data)

        // create "a" HTML element with href to file & click
        const link = document.createElement('a')
        link.href = response.data.downloadURL
        link.setAttribute('download', 'tree.zip')
        document.body.appendChild(link)
        link.click()

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link)
      })
      .catch((err) => {
        console.log(err)
        toast.error('Something went wrong with your download', { autoClose: false })
      })
      .finally(() => {
        setDownloading(false)
      })
  }

  return (
    <div className='container'>
      <h1>Download Your Tree</h1>
      <p>Downloading your tree lets you keep an offline backup of your tree.
        The download will be a <code>.zip</code> file containing <code>tree.html</code> which you can open in your browser, the trees data and all the Sims images.
      </p>
      <Link className='btn btn-default' to={`/trees/${treeId}`}>Cancel</Link>
      <button
        type='submit'
        className='btn btn-primary'
        disabled={downloading}
        onClick={downloadTree}
      >{downloading ? 'Preparing your download' : 'Download'}
      </button>
    </div>
  )
}
