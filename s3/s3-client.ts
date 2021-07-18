import * as AWS from 'aws-sdk'

export const getS3Client = (() => {
  let client: AWS.S3

  return () => {
    if (!client) {
      client = new AWS.S3({})
    }

    return client
  }
})()
