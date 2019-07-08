import React, { useRef, useState } from 'react'

import { ToggleIcon, UploadImage } from '../Icon'
import { readImageFile } from '../utils'

function Control(props) {
  const [active, setActive] = useState(false)
  const uploadId = useRef()
  const inputEle = useRef()
  if (!uploadId.current) {
    uploadId.current = `rtme-upload-${Math.random()
      .toString(16)
      .substr(2, 8)}`
  }

  async function uploadImageChange(evt) {
    const files = [...evt.target.files]
    inputEle.current.value = ''
    setActive(false)
    const images = await Promise.all(files.map(readImageFile))
    props.onUploadImage(images, files)
  }

  function toggleActive() {
    setActive(act => !act)
  }

  return (
    <div className="rtme-control">
      <ToggleIcon active={active} onClick={toggleActive} />
      {active && (
        <div className="rtme-ctrls">
          <div className="rtme-upload">
            <label className="rtme-upload-label" htmlFor={uploadId.current}>
              <UploadImage />
            </label>
            <input
              ref={inputEle}
              multiple
              id={uploadId.current}
              type="file"
              accept="image/*"
              onChange={uploadImageChange}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Control
