import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import adele from 'adele'

import plumTreeApp from './redux/reducers'

import 'normalize.css'
import 'react-toastify/dist/ReactToastify.css'

import './common/styles/app.scss'
import Layout from './components/Layout'
import Public from './components/trees/Public'

adele({
  endpoint: '/api/adele'
})
const store = createStore(plumTreeApp)

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <div>
        <ToastContainer
          autoClose={8000}
          position={toast.POSITION.TOP_CENTER}
          toastClassName='alert'
        />
        <Switch>
          <Route exact path='/public/:treeId' component={Public} />
          <Layout />
        </Switch>
      </div>
    </Provider>
  </BrowserRouter>,
  document.getElementById('app')
)
