import React, { useEffect, useRef, useState } from 'react'

import Control from './Control'
import { KeyCode } from '../constant'
import { useEditor } from '../context'
import { setCursorPosition } from '../utils'

function TextElement(props) {
  const { focusId, setFocusId, cursor, setCursor, placeholder } = useEditor()
  const textRef = useRef()
  const [height, setHeight] = useState()
  const {
    data,
    onChange = () => {},
    onRemove = () => {},
    onAddText = () => {},
    onMergeTextOrRemoveOtherMedia = () => {},
    onAddImages = () => {},
  } = props

  // set textarea height default 1em
  useEffect(() => {
    setHeight(textRef.current.scrollHeight)
  }, [])

  // auto resize textarea height to ensure textarea has not scroll
  useEffect(() => {
    if (textRef.current.offsetHeight !== textRef.current.scrollHeight) {
      setHeight(textRef.current.scrollHeight)
    }
  }, [data.raw])

  // control focus target
  useEffect(() => {
    if (focusId === data._id) {
      textRef.current.focus()
      if (cursor > -1) {
        setCursorPosition(textRef.current, cursor)
      }
      // do this!!
      setCursor()
    } else {
      textRef.current.blur()
    }
  }, [focusId, data._id, cursor, setCursor])

  function focusHandler() {
    setFocusId(data._id)
  }

  function updateText(evt) {
    onChange({
      ...data,
      raw: evt.target.value,
    })
  }

  function textKeyDownHandler(evt) {
    // evt.persist()
    switch (evt.keyCode) {
      // prevent textarea paragraph wrap
      // will create a new textarea for next paragraph
      case KeyCode.ENTER: {
        evt.preventDefault()
        onAddText(data, evt.target.selectionStart)
        break
      }
      // remove empty text config row after delete it
      case KeyCode.DELETE: {
        if (!evt.target.value) {
          evt.preventDefault()
          onRemove(data)
        } else if (evt.target.selectionStart === 0) {
          // merge with upper text or remove upper media
          onMergeTextOrRemoveOtherMedia(data)
        }
        break
      }
      default:
        break
    }
  }

  return (
    <div className="rtme-row">
      {focusId === data._id && (
        <Control onUploadImage={(images, files) => onAddImages(images, files, data)} />
      )}
      <textarea
        ref={textRef}
        className="rtme-textarea"
        value={data.raw}
        onChange={updateText}
        onKeyDown={textKeyDownHandler}
        placeholder={placeholder || 'Please Type Something'}
        style={height ? { height } : undefined}
        onFocus={focusHandler}
      />
      {props.sortHandle}
    </div>
  )
}

export default TextElement
