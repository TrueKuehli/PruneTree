import React from 'react';
import ReactDOM from 'react-dom/client';
import 'regenerator-runtime/runtime';

import Download from './components/trees/Download';

import 'normalize.css';
import './common/styles/app.scss';


const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
    <Download
      tree={window.tree}
      people={window.people}
    />,
);
