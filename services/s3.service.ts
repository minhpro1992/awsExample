import { PresignedPost } from "aws-sdk/clients/s3";
import { getS3Client } from "../s3/s3-client";

export const getS3PostPresignedUploadFile = ({
    bucketName,
    fileName
}: {
    bucketName: string,
    fileName :string
}): PresignedPost=> {
    if (bucketName && fileName) {
    const params = {
        Bucket: bucketName,
        Fields: {
          key: fileName,
        },
      };
      return getS3Client().createPresignedPost(params);
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
          return getS3Client().getSignedUrlPromise(
            "getObject",
            params
          );
    }
    return null
}