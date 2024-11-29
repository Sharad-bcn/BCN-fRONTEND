import { genUniqueKey } from 'helpers'

const qualityOptions = {
  listing: 0.75,
  business: 0.75,
  logo: 0.75
}
// const sizeOptions = {
//   listings: 1000000, //1mb
//   logo: 1000000 //1mb
// }
// const MAX_WIDTH = 500
// const MAX_HEIGHT = 500
const IMAGE_TYPE = 'jpeg' //'file.type or image/png or had to use image/jpeg for compression png doesn't compress, use webp for transparent background'

async function imageCompression(file, quality) {
  const image = await createImage(file)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d') //canvas.getContext('2d', { alpha: true }) // for image transparent
  let width = image.width
  let height = image.height

  // if (width > MAX_WIDTH) {
  //   height *= MAX_WIDTH / width
  //   width = MAX_WIDTH
  // }

  // if (height > MAX_HEIGHT) {
  //   width *= MAX_HEIGHT / height
  //   height = MAX_HEIGHT
  // }

  canvas.width = width
  canvas.height = height
  context.fillStyle = '#fff' // set the fill style to white
  context.fillRect(0, 0, canvas.width, canvas.height) // fill the entire canvas with white

  context.drawImage(image, 0, 0)

  const dataUrl = canvas.toDataURL('image/' + IMAGE_TYPE, quality)
  const blob = dataURLtoBlob(dataUrl)

  let newFile = new File([blob], genUniqueKey() + '.' + IMAGE_TYPE, {
    type: 'image/' + IMAGE_TYPE,
    lastModified: Date.now()
  })

  return newFile
}

function createImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = () => {
      resolve(image)
      URL.revokeObjectURL(image.src)
    }
    image.onerror = reject
  })
}

function dataURLtoBlob(dataUrl) {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = window.atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

const main = async (files, option) => {
  const newFiles = []

  for (const file of files) {
    newFiles.push(await imageCompression(file, qualityOptions[option]))
  }

  return newFiles
}

export default main
