import { PutObjectCommand } from '@aws-sdk/client-s3'
import { awsS3Config } from 'helpers'

const Bucket = process.env.REACT_APP_S3_BUCKET
const Bucket_Location = process.env.REACT_APP_S3_BUCKET_LOCATION
const REACT_APP_IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST

// export default function Main(Key, fileData) {
//   return new Promise((resolve, reject) => {

//     const params = {
//       Bucket,
//       Key: Bucket_Location + Key,
//       Body: fileData // The file data you want to upload
//     }

//     s3.upload(params, (err, data) => {
//       if (err) {
//         console.error('Error uploading file:', err)
//         reject('Error uploading file:')
//       } else {
//         // console.log('File uploaded successfully:', data.Location)
//         resolve(data.Location)
//         // Handle success and update your component state as needed
//       }
//     })
//   })
// }

const Main = async (Key, fileData) => {
  const params = {
    Bucket,
    Key: Bucket_Location + Key,
    Body: fileData // The file data you want to upload
  }

  try {
    const command = new PutObjectCommand(params)
    const data = await awsS3Config.send(command)
    // console.log('File uploaded successfully:', data)
    // Handle success and update your component state as needed
    const url = REACT_APP_IMAGE_HOST + Key
    return url
  } catch (err) {
    console.error('Error uploading file:', err)
    throw new Error('Error uploading file')
  }
}

export default Main
