export function guid(prefix = '') {
  return `${prefix}_${Math.random()
    .toString(16)
    .substr(2, 8)}${Math.random()
    .toString(16)
    .substr(2, 8)}`
}

export function setCursorPosition(target, position) {
  if (target && target.setSelectionRange) {
    target.setSelectionRange(position, position)
  }
}

export function readImageFile(file) {
  return new Promise(function readEachFile(resolve) {
    const fileId = guid('file')
    // eslint-disable-next-line
    file._id = fileId
    const fileReader = new FileReader()

    // get image base64
    fileReader.onload = function onFileLoad(e) {
      const source = e.target.result

      const img = new window.Image()
      img.src = source

      // get image width & height
      img.onload = function onImageLoad() {
        resolve({
          _id: fileId,
          name: file.name,
          size: file.size,
          width: img.width,
          height: img.height,
          url: source,
        })
      }
    }

    fileReader.readAsDataURL(file)
  })
}
