import React from 'react';
import Markdown from 'react-markdown';
import {defListHastHandlers, remarkDefinitionList} from 'remark-definition-list';
import {Link} from 'react-router-dom';

import content from './content.md';


export default function Support() {
  return (
    <div className='container'>
      <Markdown
        remarkPlugins={[remarkDefinitionList]}
        remarkRehypeOptions={{handlers: defListHastHandlers}}
        components={{
          'a': ({children, href}) => {
            return <Link to={href}>{children}</Link>;
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}