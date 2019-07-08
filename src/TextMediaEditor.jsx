import React, { useState } from 'react'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import arrayMove from 'array-move'

import { MoveIcon } from './Icon'
import Element from './Element'
import { guid } from './utils'
import { DataType } from './constant'
import EditorContext from './context'

import './styles/index.css'

const prefix = 'row'

function initConfigData(rows = []) {
  if (!rows.length) {
    return [{ _id: guid(prefix), type: DataType.text, raw: '' }]
  }
  return rows.map(item => ({
    _id: item._id || guid(prefix),
    ...item,
    status: item.type === DataType.image ? 'done' : 'uploading',
  }))
}

function cleanConfigData(rows = []) {
  return rows
    .filter(item => item.raw || item.status === 'done')
    .map(({ _id, status, ...row }) => row)
}

const SortableHandleIcon = SortableHandle(() => <MoveIcon />)

const SortableItem = SortableElement(({ data, ...actions }) => (
  <Element
    data={data}
    onChange={actions.onChange}
    onRemove={actions.onRemove}
    onAddText={actions.onAddText}
    onMergeTextOrRemoveOtherMedia={actions.onMergeTextOrRemoveOtherMedia}
    onAddImages={actions.onAddImages}
    sortHandle={<SortableHandleIcon />}
  />
))

const SortableList = SortableContainer(({ items, ...actions }) => {
  return (
    <div>
      {items.map((item, index) => (
        <SortableItem index={index} key={item._id} data={{ ...item }} {...actions} />
      ))}
    </div>
  )
})

function TextMediaEditor(props) {
  const { onChange = () => {} } = props
  const [focusId, setFocusId] = useState()
  const [cursor, setCursor] = useState()
  const [config, _setConfig] = useState(initConfigData(props.value || []))

  function setConfig(rows) {
    _setConfig(rows)
    onChange(cleanConfigData(rows))
  }

  function updateData(newRow) {
    const newConfig = config.map(item => {
      if (item._id === newRow._id) {
        return newRow
      }
      return item
    })
    setConfig(newConfig)
  }

  // remove data
  // focus previous text row if exist
  function removeData(data) {
    if (config.length === 1) {
      if (data.type === DataType.text) {
        setConfig([{ ...data, raw: '' }])
      } else {
        const newEmptyTextId = guid(prefix)
        setConfig([{ _id: newEmptyTextId, type: DataType.text, raw: '' }])
        setFocusId(newEmptyTextId)
      }
      return
    }

    const rowIndex = config.map(item => item._id).indexOf(data._id)
    const prevRow = config[rowIndex - 1]
    setConfig(config.filter(item => item._id !== data._id))
    if (prevRow) {
      setFocusId(prevRow._id)
    }
  }

  // merge two text row when enter delete key in line start
  // or remove upper media
  function mergeTextOrRemoveMedia(data) {
    const rowIndex = config.map(item => item._id).indexOf(data._id)
    const prevRow = config[rowIndex - 1]
    if (!prevRow) {
      return
    }

    // merge two text rows
    if (prevRow.type === DataType.text) {
      const newConfig = []
      config.forEach(item => {
        if (item._id === prevRow._id) {
          newConfig.push({
            ...item,
            raw: `${item.raw}${data.raw}`,
          })
        } else if (item._id !== data._id) {
          newConfig.push(item)
        }
      })
      setConfig(newConfig)
      // set cursor to prev line end
      setCursor(prevRow.raw.length)
      setFocusId(prevRow._id)
    }

    // remove upper media
    // setConfig(config.filter(item => item._id !== prevRow._id))
  }

  // add a empty text
  // or focus next empty text
  function addText(prevRow, cursorPosition) {
    // ignore empty text's enter key event
    if (!prevRow.raw) {
      return
    }

    const newTextRowId = guid(prefix)
    const newTextRow = {
      _id: newTextRowId,
      type: DataType.text,
      raw: '',
    }

    // add a text row up when cursor is in first col
    if (cursorPosition === 0) {
      const newConfig = []
      config.forEach(item => {
        if (item._id === prevRow._id) {
          newConfig.push(newTextRow)
        }
        newConfig.push(item)
      })
      setConfig(newConfig)
      setFocusId(newTextRowId)
      return
    }

    // break raw
    if (cursorPosition < prevRow.raw.length) {
      const prevNewRaw = prevRow.raw.substr(0, cursorPosition)
      const newTextRaw = prevRow.raw.substr(cursorPosition)
      newTextRow.raw = newTextRaw
      const newConfig = []
      config.forEach(item => {
        if (item._id === prevRow._id) {
          newConfig.push({
            ...item,
            raw: prevNewRaw,
          })
          newConfig.push(newTextRow)
        } else {
          newConfig.push(item)
        }
      })
      setConfig(newConfig)
      // set cursor next line start
      setCursor(0)
      setFocusId(newTextRowId)
      return
    }

    const prevRowIndex = config.map(item => item._id).indexOf(prevRow._id)
    const nextRow = config[prevRowIndex + 1]
    // has a empty text below
    if (nextRow && nextRow.type === DataType.text && !nextRow.raw) {
      setFocusId(nextRow._id)
      return
    }

    const newConfig = []
    config.forEach(item => {
      newConfig.push(item)
      if (item._id === prevRow._id) {
        newConfig.push(newTextRow)
      }
    })
    setConfig(newConfig)
    setFocusId(newTextRowId)
  }

  function preInsert() {
    const newFirstTextRow = {
      _id: guid(prefix),
      type: DataType.text,
      raw: '',
    }

    setConfig([newFirstTextRow, ...config])
    setFocusId(newFirstTextRow._id)
  }

  function postInsert() {
    const newLastTextRow = {
      _id: guid(prefix),
      type: DataType.text,
      raw: '',
    }

    setConfig([...config, newLastTextRow])
    setFocusId(newLastTextRow._id)
  }

  function fileUploaded(files) {
    const fileIds = files.map(f => f._id)
    // must do this
    _setConfig(prevConfig => {
      const nextConfig = prevConfig.map(item => {
        if (item.type === DataType.image && fileIds.includes(item._id)) {
          const matched = files[fileIds.indexOf(item._id)]
          return {
            ...item,
            url: matched.url || item.url,
            status: matched.status,
          }
        }
        return item
      })
      // 🤔 any good ideas
      onChange(cleanConfigData(nextConfig))
      return nextConfig
    })
  }

  function addImages(images = [], files, prevRow) {
    const newConfig = []
    config.forEach(item => {
      newConfig.push(item)
      if (item._id === prevRow._id) {
        newConfig.push(
          ...images.map(image => ({
            ...image,
            type: DataType.image,
            status: 'uploading',
          }))
        )
      }
    })

    setConfig(newConfig)

    if (typeof props.uploadImages === 'function') {
      // notice: hooks callback remember current config
      props.uploadImages(files, fileUploaded)
    }
  }

  function onSortEnd({ oldIndex, newIndex }) {
    setConfig(arrayMove(config, oldIndex, newIndex))
  }

  // add empty row up and down
  const firstRowIsText = config[0] && config[0].type === DataType.text
  const lastRowIsText =
    config[config.length - 1] && config[config.length - 1].type === DataType.text

  return (
    <EditorContext.Provider
      value={{ focusId, setFocusId, cursor, setCursor, placeholder: props.placeholder }}
    >
      <div className="react-text-media-editor">
        {!firstRowIsText && <div className="rtme-text-placeholder" onClick={preInsert} />}
        <SortableList
          items={config}
          onChange={updateData}
          onRemove={removeData}
          onAddText={addText}
          onMergeTextOrRemoveOtherMedia={mergeTextOrRemoveMedia}
          onAddImages={addImages}
          onSortEnd={onSortEnd}
          useDragHandle
        />
        {!lastRowIsText && <div className="rtme-text-placeholder" onClick={postInsert} />}
      </div>
    </EditorContext.Provider>
  )
}

export default TextMediaEditor
