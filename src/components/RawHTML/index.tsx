import React from 'react';


type Props = {
  html: string;
};


/**
 * A component that renders raw HTML, used for rendering Rich Text fields with contents generated
 *   by the RichEditor.
 * @param html - The raw HTML to render.
 */
export default function RawHTML({html}: Props) {
  return (
    <div dangerouslySetInnerHTML={{__html: html}} />
  );
}
