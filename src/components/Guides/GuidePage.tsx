import React from 'react';
import Markdown, {Components} from 'react-markdown';
import {Link} from 'react-router-dom';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import {remarkDefinitionList, defListHastHandlers} from 'remark-definition-list';

import GuideNavLinks, {GuideLinkData} from './GuideNavLinks';
import MobileMock from './MobileMock';

import assets from './assets';


type Props = {
  title: string;
  path: string;
  markdown: string;
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
export default function GuidePage({markdown, isIndex = false, navLinks = {}}: Props) {
  return (
    <div>
      {!isIndex &&
        <div style={{paddingTop: 15}}>
          <Link to="/guides" className="btn btn-default">
            <i className="icon-list"/> Guides Index
          </Link>
        </div>
      }

      <Markdown
        remarkPlugins={[remarkDefinitionList, remarkDirective, remarkDirectiveRehype]}
        remarkRehypeOptions={{handlers: defListHastHandlers}}
        components={{
          'a': ({children, href}) => {
            return <Link to={href}>{children}</Link>;
          },
          'img': ({alt, title, src, ...props}) => {
            return (
              assets[src]?.mp4 ?
                <video src={assets[src]?.mp4} autoPlay={true} loop={true} muted={true} aria-description={alt}
                       style={{width: '100%'}}/> :

                assets[src]?.jpg &&
                  <picture>
                    { assets[src]?.webp && <source srcSet={assets[src]?.webp} type="image/webp" /> }
                    <img {...props} alt={alt || title} src={assets[src]?.jpg} style={{width: '100%'}} />
                  </picture>
            );
          },
          'mobile-mock': ({children: alt, id}) => {
            return <MobileMock display={assets[id]} alt={alt} />;
          },
          'caption-img': ({children: alt, id, width, height, title}) => {
            return (
              <div style={{textAlign: 'center'}}>
                {
                  assets[id]?.mp4 ?
                    <video src={assets[id]?.mp4} autoPlay={true} loop={true} muted={true} aria-description={alt}
                           style={{display: 'block', margin: '0px auto', maxWidth: '100%'}}/> :

                    assets[id]?.jpg &&
                    <picture>
                      {assets[id]?.webp && <source srcSet={assets[id]?.webp} type="image/webp"/>}
                      <img {...{width, height, title, alt}} alt={alt || title} src={assets[id]?.jpg}
                           style={{display: 'block', margin: '0px auto', maxWidth: '100%'}}/>
                    </picture>
                }

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
