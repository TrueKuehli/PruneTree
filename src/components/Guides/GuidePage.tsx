import React from 'react';
import Markdown, {Components} from 'react-markdown';
import {Link} from 'react-router-dom';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import {remarkDefinitionList, defListHastHandlers} from 'remark-definition-list';

import GuideNavLinks, {GuideLinkData} from './GuideNavLinks';
import GuideIndexLink from './GuideIndexLink';
import MobileMock from './MobileMock';


type Props = {
  title: string;
  path: string;
  markdown: string;
  resources?: {[key: string]: string};
  isIndex?: boolean;
  navLinks?: GuideLinkData;
}

type CustomComponents = Partial<Components> & {
  'mobile-mock': React.FC<{children: string, id: string}>;
  'caption-img': React.FC<{children: string, id: string, width: string, height: string, title: string}>;
  'underline': React.FC<{children: string}>;
}

/**
 * A guide page, rendered from a markdown file.
 */
export default function GuidePage({markdown, resources, isIndex = false, navLinks = {}}: Props) {
  return (
    <div>
      {!isIndex &&
        <GuideIndexLink />
      }

      <Markdown
        remarkPlugins={[remarkDefinitionList, remarkDirective, remarkDirectiveRehype]}
        remarkRehypeOptions={{handlers: defListHastHandlers}}
        components={{
          'a': ({children, href}) => {
            return <Link to={href}>{children}</Link>;
          },
          'img': ({alt, title, src, ...props}) => {
            return <img {...props} alt={alt || title} src={resources[src]} width={'100%'} />;
          },
          'mobile-mock': ({children: alt, id}) => {
            return <MobileMock display={resources[id]} alt={alt} />;
          },
          'caption-img': ({children: alt, id, width, height, title}) => {
            return (
              <div style={{textAlign: 'center'}}>
                <img {...{width, height, title, alt}}
                     style={{display: 'block', margin: '0px auto'}}
                     src={resources[id]}
                     alt={alt || title}
                />
                {title && <small>{title}</small>}
              </div>
            );
          },
          'underline': ({children}) => {
            return <u>{children}</u>;
          },
          'div': ({children, className}) => {
            return <div className={className}>{children}</div>;
          },
        } as CustomComponents}
      >
        {markdown}
      </Markdown>

      {!isIndex &&
        <GuideNavLinks {...navLinks} />
      }
    </div>
  );
}
