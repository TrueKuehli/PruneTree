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
 * @param prevLink The link to the previous guide, can be empty on the first guide.
 * @param prevText The text to display for the previous guide, can be empty on the first guide.
 * @param nextLink The link to the next guide, can be empty on the last guide.
 * @param nextText The text to display for the next guide, can be empty on the last guide.
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
