import React from 'react'

import TextElement from './TextElement'
import ImageElement from './ImageElement'

import { DataType } from '../constant'

function Element(props) {
  const { data } = props

  if (data.type === DataType.text) {
    return <TextElement {...props} />
  }

  if (data.type === DataType.image) {
    return <ImageElement {...props} />
  }

  return null
}

export default Element
