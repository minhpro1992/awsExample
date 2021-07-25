import { GetObjectOutput, GetObjectRequest, PresignedPost } from "aws-sdk/clients/s3";
import * as XLSX from 'xlsx'
import { WorkBook, WorkSheet } from 'xlsx'
import { getS3Client } from "../s3/s3-client";

export const getS3PostPresignedUploadFile = async ({
    bucketName,
    fileName
}: {
    bucketName: string,
    fileName :string
}): Promise<PresignedPost>=> {
    if (bucketName && fileName) {
    const params = {
        Bucket: bucketName,
        Fields: {
          key: fileName,
        },
      };
      return await getS3Client().createPresignedPost(params);
    }
    return null;
}

export const getS3PresignedURL = async({
    bucketName,
    fileName
}: {
    bucketName: string,
    fileName: string
})=> {
    if(bucketName && fileName) {
        const params = {
            Bucket: bucketName,
            Key: fileName,
          };
          return await getS3Client().getSignedUrlPromise(
            "getObject",
            params
          );
    }
    return null
}

export const getWorkbookFromS3 = async({
    bucketName,
    fileName
}: {
    bucketName: string,
    fileName: string
}) => {
    if(bucketName && fileName) {
        const params = {
            Bucket: bucketName,
            Key: fileName
        } as unknown as GetObjectRequest
        const s3ObjectReadStream = getS3Client().getObject(params).createReadStream()
        const buffers = []

        return new Promise((resolve, reject) => {
            s3ObjectReadStream
            .on('data', (data) => {
                buffers.push(data)
            })
            .on('error', (error) => {
                reject(error)
            })
            .on('skip', (error) => {
                console.log('Skip data while reading xlsx file ', error)
            })
            .on('end', () => {
                const buffer = Buffer.concat(buffers)
                const workbook = XLSX.read(buffer, {
                type: 'buffer',
                cellDates: true,
                cellStyles: true
                }) as WorkBook
                s3ObjectReadStream.destroy()
                resolve(workbook)
            })
        })
    }
    return null
}

export const writeWorkBookToS3 = async ({
    bucketName,
    objectKey,
    workBook
}: {
    bucketName: string,
    objectKey: string,
    workBook: WorkBook

}) => {
    const bufferXlsx = await XLSX.write(workBook, {
      type: 'buffer',
      bookType: 'xlsx',
      cellDates: true,
      cellStyles: true
    })
  
    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Body: bufferXlsx,
      ContentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ContentEncoding: 'utf-8'
    }
  
    return await getS3Client().putObject(params).promise()
  }