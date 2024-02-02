import React, {useState, useEffect, useRef} from 'react';
import type {DraftHandleValue, Editor, EditorCommand, EditorState} from 'draft-js';

import Loading from '../Loading';

import 'draft-js/dist/Draft.css';


const BLOCK_TYPES = [
  {icon: 'list-ul', style: 'unordered-list-item'},
  {icon: 'list-ol', style: 'ordered-list-item'},
];

const INLINE_STYLES = [
  {icon: 'bold', style: 'BOLD'},
  {icon: 'italic', style: 'ITALIC'},
  {icon: 'underline', style: 'UNDERLINE'},
  {icon: 'strikethrough', style: 'STRIKETHROUGH'},
];

type Props = {
  initialHtml?: string;
  onUpdate?: (html: string) => void;
};


/**
 * A component that renders a rich text editor.
 * @param initialHtml - The initial HTML to render in the editor.
 * @param onUpdate - A callback that is invoked with the current HTML whenever the
 *   editor's contents change.
 */
export default function RichEditor({initialHtml, onUpdate}: Props) {
  const [loading, setLoading] = useState(true);
  const [editorState, setEditorState] = useState<EditorState>(null);
  const editorRef = useRef<Editor>(null);

  // Dynamically import DraftJS
  const [draftJS, setDraftJS] = useState<typeof import('draft-js')>(null);
  const [draftJSExport, setDraftJSExport] = useState<typeof import('draft-js-export-html')>(null);
  const [draftJSImport, setDraftJSImport] = useState<typeof import('draft-js-import-html')>(null);

  useEffect(() => {
    Promise.all([
      import('draft-js'),
      import('draft-js-export-html'),
      import('draft-js-import-html'),
    ]).then(([draftJS, draftJSExport, draftJSImport]) => {
      setDraftJS(draftJS);
      setDraftJSExport(draftJSExport);
      setDraftJSImport(draftJSImport);
    });
  }, []);

  const {Editor, EditorState, RichUtils} = draftJS || {};
  const {stateToHTML} = draftJSExport || {};
  const {stateFromHTML} = draftJSImport || {};

  useEffect(() => {
    if (!EditorState || !stateFromHTML) return;

    let editorState: EditorState;
    if (initialHtml) {
      const contentState = stateFromHTML(initialHtml);
      editorState = EditorState.createWithContent(contentState);
    } else {
      editorState = EditorState.createEmpty();
    }

    setEditorState(editorState);
    setLoading(false);
  }, [EditorState, stateFromHTML]);

  useEffect(() => {
    if (!editorState) return;

    const content = editorState.getCurrentContent();
    const html = stateToHTML(content);

    onUpdate && onUpdate(html);
  }, [editorState]);

  // Wait until all imports are loaded
  if (!draftJS || !draftJSImport || !draftJSExport) {
    return <Loading />;
  }

  /**
   * Callback that updates the editor's state, which invokes the onUpdate callback in a dependent useEffect.
   * @param newEditorState - The new editor state.
   */
  function handleChange(newEditorState: EditorState) {
    setEditorState(newEditorState);
  }

  /**
   * Callback that focuses the editor.
   */
  function handleFocus() {
    editorRef.current && editorRef.current.focus();
  }

  /**
   * Callback that handles a key command.
   * @param command - The key command to handle.
   * @returns True if the state was updated, false otherwise.
   */
  function onKeyCommand(command: EditorCommand): DraftHandleValue {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  /**
   * Callback that handles a tab key press.
   * @param e - The key event.
   */
  function handleTab(e: React.KeyboardEvent<object>) {
    const maxDepth = 4;
    handleChange(RichUtils.onTab(e, editorState, maxDepth));
  }

  /**
   * Callback that toggles a specified block type.
   * @param blockType - The block type to toggle.
   */
  function toggleBlockType(blockType: string) {
    handleChange(
      RichUtils.toggleBlockType(
        editorState,
        blockType,
      ),
    );
  }

  /**
   * Callback that toggles a specified inline style.
   * @param inlineStyle - The inline style to toggle.
   */
  function toggleInlineStyle(inlineStyle: string) {
    handleChange(
      RichUtils.toggleInlineStyle(
        editorState,
        inlineStyle,
      ),
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='form-group'>
      <label>Description</label>

      <StylesToolbar
        editorState={editorState}
        toggleBlockType={toggleBlockType}
        toggleInlineStyle={toggleInlineStyle}
      />

      <div className='form-control draft-editor' onClick={handleFocus}>
        <Editor
          editorState={editorState}
          handleKeyCommand={onKeyCommand}
          onChange={handleChange}
          onTab={handleTab}
          ref={editorRef}
          spellCheck
        />
      </div>
    </div>
  );
}


type StyleButtonProps = {
  onToggle: (style: string) => void;
  style: string;
  active: boolean;
  icon: string;
};

/**
 * A component that renders a button for toggling a style.
 * @param onToggle - The callback to invoke when the button is clicked.
 * @param style - The style to toggle.
 * @param active - Whether the style is currently active.
 * @param icon - The icon to display on the button.
 */
function StyleButton({onToggle, style, active, icon}: StyleButtonProps) {
  /**
   * Callback that toggles the style.
   * @param e - The click event.
   */
  function handleToggle(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    e.preventDefault();
    onToggle(style);
  }

  return (
    <span className={active ? 'btn btn-primary' : 'btn btn-default'} onMouseDown={handleToggle}>
      <i className={`icon-${icon}`} />
    </span>
  );
}


type StylesToolbarProps = {
  editorState: EditorState;
  toggleBlockType: (style: string) => void;
  toggleInlineStyle: (style: string) => void;
};

/**
 * A component that renders a toolbar for toggling styles.
 * @param editorState - The editor state.
 * @param toggleBlockType - The callback to invoke when a block type is toggled.
 * @param toggleInlineStyle - The callback to invoke when an inline style is toggled.
 */
function StylesToolbar({editorState, toggleBlockType, toggleInlineStyle}: StylesToolbarProps) {
  const currentStyle = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  const handleInlineToggle = (style: string) => toggleInlineStyle(style);
  const handleBlockToggle = (style: string) => toggleBlockType(style);

  return (
    <div className='input-group'>
      {INLINE_STYLES.map((type) =>
        <StyleButton
          key={type.icon}
          icon={type.icon}
          active={currentStyle.has(type.style)}
          onToggle={handleInlineToggle}
          style={type.style}
        />,
      )}
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.icon}
          icon={type.icon}
          active={type.style === blockType}
          onToggle={handleBlockToggle}
          style={type.style}
        />,
      )}
    </div>
  );
}
