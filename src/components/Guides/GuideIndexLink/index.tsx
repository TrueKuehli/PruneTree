import React from 'react';
import {Link} from 'react-router-dom';


/**
 * Reusable element that links back to the guides index page.
 */
export default function GuideIndexLink() {
  return (
    <div style={{paddingTop: 15}}>
      <Link to='/guides' className='btn btn-default'>
        <i className='icon-list'/> Guides Index
      </Link>
    </div>
  );
}
