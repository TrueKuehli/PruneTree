import React from 'react';
import {Link} from 'react-router-dom';


type Props = {
  prevLink?: string;
  prevText?: string;
  nextLink?: string;
  nextText?: string;
};


/**
 * Reusable element that links to the previous and next guide.
 */
export default function GuideNavLinks({prevLink, prevText, nextLink, nextText}: Props) {
  return (
    <div style={{textAlign: 'center'}}>
      {
        prevLink &&
          <Link to={prevLink} className='btn btn-default'>
            <i className='icon-chevron-left' /> {prevText}
          </Link>
      }
      {
        nextLink &&
          <Link to={nextLink} className='btn btn-default'>
            {nextText} <i className='icon-chevron-right' />
          </Link>
      }
    </div>
  );
}
