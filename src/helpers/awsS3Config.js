import { S3Client } from '@aws-sdk/client-s3'
const accessKeyId = process.env.REACT_APP_S3_ACCESS_KEY
const secretAccessKey = process.env.REACT_APP_S3_SECRET_ACCESS_KEY
const region = process.env.REACT_APP_S3_REGION

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

export default s3Client
