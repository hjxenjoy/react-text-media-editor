import React, { useEffect } from 'react'

import { KeyCode } from '../constant'
import { useEditor } from '../context'

function ImageElement(props) {
  const { focusId, setFocusId } = useEditor()
  const { data, onRemove = () => {} } = props
  const focused = focusId === data._id

  useEffect(() => {
    function removeImage(evt) {
      if (evt.keyCode === KeyCode.DELETE) {
        setFocusId()
        onRemove(data)
      }
    }

    if (focusId === data._id) {
      // a bug hack
      // enter delete key to remove text below will trigger this event
      // guess event is persistent but comment evt.persist() is useless
      setTimeout(() => {
        document.addEventListener('keyup', removeImage)
      }, 150)
    }
    return () => document.removeEventListener('keyup', removeImage)
  }, [data, focusId, onRemove, setFocusId])

  function focusThis(evt) {
    evt.stopPropagation()
    if (focusId !== data._id) {
      setFocusId(data._id)
    }
  }

  function cancelFocus() {
    setFocusId()
  }

  return (
    <div className="rtme-row" onClick={cancelFocus}>
      <div
        className={`rtme-media-box${focused ? ' media-focused' : ''} media-upload-${data.status}`}
        onClick={focusThis}
      >
        <img className="rtme-image" src={data.url} alt={data.name} style={{ width: data.width }} />
      </div>
      {props.sortHandle}
    </div>
  )
}

export default ImageElement
