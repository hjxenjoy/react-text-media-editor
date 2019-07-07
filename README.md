# React Text Media Editor

Simple React Web Editor Only Support Text and Medias

## Demo

```sh
npm start
```

## Installation

Using [npm](https://www.npmjs.com/package/react-text-media-editor):

```sh
npm install --save react-text-media-editor react-sortable-hoc
```

## Usage

Basic Example

```js
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import RtmEditor from 'react-text-media-editor'
import 'react-text-media-editor/dist/style.css'

const IMAGE = 'https://picsum.photos/500/150'

const InitialValue = [
  { type: 'TEXT', raw: 'React Text Media Editor Example' },
  { type: 'IMAGE', url: IMAGE, name: 'Pic.png', width: 500, height: 150 },
]

function Example() {
  const [value, setValue] = useState(InitialValue)

  function updateValue(nextValue) {
    console.log(nextValue)
    // setValue(nextValue)
  }

  function uploadImages(files, callback) {
    // put your upload function here
    setTimeout(() => {
      callback(
        files.map(file => ({
          status: 'done',
          url: '', // 'https://your.domain.com/your/image/url',
          _id: file._id,
        }))
      )
    }, 1000)
  }

  return (
    <div className="example">
      <h1>React Text Media Editor Example</h1>
      <RtmEditor
        value={value}
        onChange={updateValue}
        uploadImages={uploadImages}
        placeholder="Please Input Your Idea"
      />
    </div>
  )
}

ReactDOM.render(<Example />, document.getElementById('root'))
```
