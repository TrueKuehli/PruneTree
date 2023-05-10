import React, { useState, useEffect, useRef } from 'react'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import { Editor, EditorState, RichUtils } from 'draft-js'
import 'draft-js/dist/Draft.css'
import Loading from '../Loading'

const BLOCK_TYPES = [
  { icon: 'list-ul', style: 'unordered-list-item' },
  { icon: 'list-ol', style: 'ordered-list-item' }
]

const INLINE_STYLES = [
  { icon: 'bold', style: 'BOLD' },
  { icon: 'italic', style: 'ITALIC' },
  { icon: 'underline', style: 'UNDERLINE' },
  { icon: 'strikethrough', style: 'STRIKETHROUGH' }
]

export default ({ initialHtml, onUpdate }) => {
  const [loading, setLoading] = useState(true)
  const [editorState, setEditorState] = useState(null)

  const editorRef = useRef(null)

  useEffect(() => {
    let editorState
    if (initialHtml) {
      const contentState = stateFromHTML(initialHtml)
      editorState = EditorState.createWithContent(contentState)
    } else {
      editorState = EditorState.createEmpty()
    }
    setEditorState(editorState)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (editorState) {
      const content = editorState.getCurrentContent()
      const html = stateToHTML(content)

      onUpdate && onUpdate(html)
    }
  }, [editorState])

  function handleChange (newEditorState) {
    setEditorState(newEditorState)
  }

  function handleFocus () {
    editorRef.current && editorRef.current.focus()
  }

  function onKeyCommand (command) {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      handleChange(newState)
      return true
    }
    return false
  }

  function handleTab (e) {
    const maxDepth = 4
    this.handleChange(RichUtils.onTab(e, editorState, maxDepth))
  }

  function toggleBlockType (blockType) {
    handleChange(
      RichUtils.toggleBlockType(
        editorState,
        blockType
      )
    )
  }

  function toggleInlineStyle (inlineStyle) {
    handleChange(
      RichUtils.toggleInlineStyle(
        editorState,
        inlineStyle
      )
    )
  }

  if (loading) {
    return <Loading />
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
  )
}

const StyleButton = ({ onToggle, style, active, icon }) => {
  function handleToggle (e) {
    e.preventDefault()
    onToggle(style)
  }

  return (
    <span className={active ? 'btn btn-primary' : 'btn btn-default'} onMouseDown={handleToggle}>
      <i className={`icon-${icon}`} />
    </span>
  )
}

const StylesToolbar = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle()
  const { editorState } = props
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()
  const handleInlineToggle = (style) => props.toggleInlineStyle(style)
  const handleBlockToggle = (style) => props.toggleBlockType(style)

  return (
    <div className='input-group'>
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.icon}
          icon={type.icon}
          active={currentStyle.has(type.style)}
          onToggle={handleInlineToggle}
          style={type.style}
        />
      )}
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.icon}
          icon={type.icon}
          active={type.style === blockType}
          onToggle={handleBlockToggle}
          style={type.style}
        />
      )}
    </div>
  )
}
