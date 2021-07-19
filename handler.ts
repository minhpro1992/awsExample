import BucketType from "./enums/bucket-type";
import _ from "lodash";
// import Log from "@dazn/lambda-powertools-logger";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  Handler,
  S3Event,
  APIGatewayProxyResult,
} from "aws-lambda";
import { s3Service } from "./services";
const apiResult = ({statusCode, body} : {statusCode: number, body: unknown}) => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body)
  }
}

export const hello = async (event: APIGatewayProxyEvent) => {
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

export const getS3PostPresignedUploadFile: Handler = async (
  event: APIGatewayProxyEvent
) => {
  const { bucketType, fileName } = event.queryStringParameters;
  // Log.debug("Starting-getS3PostPresignedUploadFile");
  const bucketName = BucketType.fromType(bucketType as unknown as number)?.bucketName;
  try {
    const uploadUrl = s3Service.getS3PostPresignedUploadFile({
      bucketName,
      fileName,
    });
    if (!uploadUrl) {
      return apiResult({
        statusCode: 400,
        body: "Invalid bucket type or file name",
      });
    }
    return apiResult({
      statusCode: 200,
      body: uploadUrl,
    });
  } catch (error) {
    return handleError(error);
  } finally {
    // Log.debug("Finished-getS3PostPresignedUploadFile");
  }
};

export const getS3PresignedURL: Handler = async (
  event: APIGatewayProxyEvent
) => {
  // Log.debug("Starting-getS3PresignedURL");
  const { bucketType, fileName } = event.queryStringParameters;
  const bucketName = BucketType.fromType(bucketType as unknown as number)?.bucketName;
  try {
    const s3Url = await s3Service.getS3PresignedURL({
      bucketName,
      fileName,
    });
    console.log(bucketName, fileName, s3Url)
    if (!s3Url) {
      return apiResult({
        statusCode: 400,
        body: "Invalid bucket type or file name",
      });
    }
    return apiResult({
      statusCode: 200,
      body: s3Url,
    });
  } catch (error) {
    return handleError(error);
  } finally {
    // Log.debug("Finished-getS3PresignedURL");
  }
};

const handleError = (error: Error) => {
  // Log.error(error.message || "error: ", error);
  return apiResult({statusCode : error["statusCode"] || 500, body: {
    message: error.message || "unknown error",
  }});
};
