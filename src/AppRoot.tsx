import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {HashRouter, Routes, Route} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'regenerator-runtime/runtime';

import {store} from './redux/store';
import Layout from './components/Layout';

import 'normalize.css';
import 'react-toastify/dist/ReactToastify.css';
import './common/styles/app.scss';


const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
    <HashRouter>
      <Provider store={store}>
        <div>
          <ToastContainer
            autoClose={8000}
            position={toast.POSITION.TOP_CENTER}
            toastClassName='alert'
            theme='colored'
          />
          <Routes>
            <Route path='/*' element={<Layout />} />
          </Routes>
        </div>
      </Provider>
    </HashRouter>,
);
