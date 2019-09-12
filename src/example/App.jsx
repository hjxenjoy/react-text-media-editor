import React, { useState } from 'react'

import Editor from '../TextMediaEditor'
import './main.css'

const IMAGE = 'https://picsum.photos/500/150'

const InitialValue = [
  { type: 'TEXT', raw: 'React Text Media Editor Example' },
  { type: 'IMAGE', url: IMAGE, name: 'Pic.png', width: 500, height: 150 },
]

function App() {
  const [value, setValue] = useState(InitialValue)

  function updateValue(nextValue) {
    setValue(nextValue)
    // eslint-disable-next-line
    console.log(nextValue)
  }

  function uploadImages(files, callback) {
    setTimeout(() => {
      callback(
        files.map(file => ({
          status: 'done',
          url: '',
          _id: file._id,
        }))
      )
    }, 2000)
  }

  return (
    <div className="example">
      <h1>React Text Media Editor Example</h1>
      <Editor
        value={value}
        onChange={updateValue}
        uploadImages={uploadImages}
        placeholder="Please Input Your Idea"
      />
    </div>
  )
}

export default App
