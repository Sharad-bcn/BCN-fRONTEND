import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { awsS3Config } from 'helpers'

const Bucket = process.env.REACT_APP_S3_BUCKET
const Bucket_Location = process.env.REACT_APP_S3_BUCKET_LOCATION

// export default function Main(Key) {
//   return new Promise((resolve, reject) => {
//     const s3 = new awsConfig.S3()

//     const params = {
//       Bucket,
//       Key: Bucket_Location + Key
//     }

//     s3.deleteObject(params, (err, data) => {
//       if (err) {
//         console.error('Error Removing file', err)
//         reject('Error Removing file')
//       } else {
//         // console.log('File uploaded successfully:', data.Location)
//         resolve('File removed: ', data)
//         // Handle success and update your component state as needed
//       }
//     })
//   })
// }

const Main = async Key => {
  try {
    const params = {
      Bucket,
      Key: Bucket_Location + Key
    }

    const command = new DeleteObjectCommand(params)
    const data = await awsS3Config.send(command)
    // console.log('File removed:', data)
    return data // Return the data on successful removal

    // Handle success and update your component state as needed
  } catch (err) {
    console.error('Error removing file', err)
    throw new Error('Error Removing file')
  }
}

export default Main
