import BucketType from "./enums/bucket-type";
import { getS3Client } from "./s3/s3-client";
import _ from "lodash";

export const hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

export const getS3PostPresignedUploadFile = async (event) => {
  const { bucketType, fileName } = event.queryStringParameters;
  console.log("query value: ", bucketType, fileName);
  const bucketName = BucketType.fromType(bucketType)?.bucketName;
  try {
    if (bucketName && fileName) {
      const params = {
        Bucket: bucketName,
        Fields: {
          key: fileName,
        },
      };
      const uploadUrl = getS3Client().createPresignedPost(params);
      return {
        statusCode: 200,
        body: uploadUrl,
      };
    } else {
      return {
        statusCode: 400,
        body: "Invalid bucket type or file name",
      };
    }
  } catch (error) {
    return handleError(error);
  }
};

export const getS3PresignedURL = async (event) => {
  const { bucketType, fileName } = event.queryStringParameters;
  const bucketName = BucketType.fromType(bucketType)?.bucketName;
  try {
    if (bucketName && fileName) {
      const params = {
        Bucket: bucketName,
        Key: fileName,
      };
      const s3Url = await getS3Client().getSignedUrlPromise(
        "getObject",
        params
      );
      console.log("s3Url: ", s3Url);
      return {
        statusCode: 200,
        body: s3Url,
      };
    } else {
      return {
        statusCode: 400,
        body: "Invalid bucket type or file name",
      };
    }
  } catch (error) {
    return handleError(error);
  }
};

const handleError = (error: Error) => {
  return apiResult(error["statusCode"] || 500, {
    message: error.message || "unknown error",
  });
};
