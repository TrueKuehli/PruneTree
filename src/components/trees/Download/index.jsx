import React from 'react'
import TreeDownload from '../TreeDownload'

export default () => {
  return (
    <div>
      <TreeDownload
        tree={window.tree}
        people={window.people}
      />
    </div>
  )
}
