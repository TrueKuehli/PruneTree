import React from 'react';
import ReactDOM from 'react-dom/client';
import 'regenerator-runtime/runtime';

import Download from './components/trees/Download';

import 'normalize.css';
import './common/styles/app.scss';


const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
    <Download
      // @ts-expect-error - tree is a global variable contained in the downloaded ./data/tree.js file
      tree={window.tree}
      // @ts-expect-error - people is a global variable contained in the downloaded ./data/people.js file
      people={window.people}
    />,
);
