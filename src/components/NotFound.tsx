import React from 'react';
import {Link} from 'react-router-dom';

import tragicClown from '../common/images/tragic-clown.jpg';


/**
 * NotFound component, shown on any routes not defined in src/Layout/index.tsx
 */
export default function NotFound() {
  return (
    <div className='container'>
      <h1 className='sr-only'>Not Found</h1>
      <p style={{textAlign: 'center'}}>Looks like this pages does not exist. <Link to='/'>Return home?</Link></p>
      <img src={tragicClown} width='100%' alt={'Sims 4 Tragic Clown'}/>
    </div>
  );
}
