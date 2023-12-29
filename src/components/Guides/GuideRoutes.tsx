import React, {cloneElement} from 'react';
import {Route, Routes} from 'react-router-dom';

import GuidePage from './GuidePage';
import NotFound from '../NotFound';


type Props = {
  homeMarkdown: string;
  children: React.ReactElement<Parameters<typeof GuidePage>[0]>[];
}


/**
 * Guides page explaining the usage of the Prune Tree App.
 */
export default function GuideRoutes({homeMarkdown, children}: Props) {
  homeMarkdown += '\n\n' + children.map((child) =>
    `- [${child.props.title}](${child.props.path})`).join('\n');

  return (
    <Routes>
      <Route path='/' element={<GuidePage markdown={homeMarkdown} isIndex={true} title={'Home'} path={'/'} />} />

      {
        children.map((child, i) => {
          const navLinks = {
            prevLink: children[i - 1]?.props.path,
            prevText: children[i - 1]?.props.title,
            nextLink: children[i + 1]?.props.path,
            nextText: children[i + 1]?.props.title,
          };

          return (
            <Route key={i} path={child.props.path} element={cloneElement(child, {navLinks})}/>
          );
        })
      }

      <Route path='/*' element={<NotFound />} />
    </Routes>
  );
}
