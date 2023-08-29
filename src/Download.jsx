import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'normalize.css'
import './common/styles/app.scss'
import Download from './components/trees/Download'

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(
  <Download
    tree={window.tree}
    people={window.people}
  />
)
