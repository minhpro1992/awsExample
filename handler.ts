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
import { dynamoDBService, s3Service } from "./services";
import { GetItemInput, QueryInput, UpdateItemInput } from "aws-sdk/clients/dynamodb";
import { PointType } from "./types";
import { WorkBook } from "xlsx/types";
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

export const getWorkbookFromS3: Handler = async(event: APIGatewayProxyEvent) => {
  try {
    const { bucketType, fileName } = event.queryStringParameters;
    const bucketName = BucketType.fromType(bucketType as unknown as number)?.bucketName;
    const workbook = await s3Service.getWorkbookFromS3({
      bucketName,
      fileName
    })
    await s3Service.writeWorkBookToS3({
      bucketName,
      objectKey: `${fileName}-dev`,
      workBook: workbook as WorkBook
    })
  } catch (error) {
    return handleError(error)
  }
}

export const getPoint: Handler = async (event: APIGatewayProxyEvent) => {
  try {
    const PLAYER_POINTS_TABLE = process.env.PLAYER_POINTS_TABLE
    const playerPointsID = event.pathParameters.ID
    const params = {
      TableName: PLAYER_POINTS_TABLE,
      Key: {
        ID: playerPointsID
      }
    }
    if(!playerPointsID) return apiResult({ statusCode: 400, body: 'ID is required'})
    const results = await dynamoDBService.getPoint(params)
    return apiResult({
      statusCode: 200,
      body: results
    })
  } catch (error) {
    return handleError(error)
  }
}

export const createPoint: Handler = async (event: APIGatewayProxyEvent) => {
  try {
    const PLAYER_POINTS_TABLE = process.env.PLAYER_POINTS_TABLE
    const body = event.body as unknown as PointType
    const firstName = body?.firstName
    const lastName = body?.lastName
    const age = body?.age
    const ID = body?.ID
  const params = {
    TableName: PLAYER_POINTS_TABLE,
    Item: {
      ID,
      firstName,
      lastName,
      age
    }
  }
  if(!ID) return apiResult({statusCode: 400, body: 'ID is required'})
  const results = await dynamoDBService.createPoint(params)
   return apiResult({
     statusCode: 200,
     body: results
   })
  } catch (error) {
    return handleError(error)
  }
}

export const updatePoint: Handler = async (event: APIGatewayProxyEvent) => {
  try {
    const PLAYER_POINTS_TABLE = process.env.PLAYER_POINTS_TABLE
    const body = event.body as unknown as PointType
    const ID = body.ID
    const firstName = body.firstName
    const lastName = body.lastName
    const age = body.age
    const params = {
      TableName: PLAYER_POINTS_TABLE,
      Key: {ID},
      UpdateExpression: 'set firstName=:firstName, lastName=:lastName, age=:age',
      ConditionExpression: 'ID=:ID',
      ExpressionAttributeValues: {
        ':ID': ID,
        ':firstName': firstName,
        ':lastName': lastName,
        ':age': age
      }
    }
    if(!ID) return apiResult({ statusCode: 400, body: 'ID is required'})
    const response = await dynamoDBService.updatePoint(params as UpdateItemInput)
    return apiResult({
      statusCode: 200,
      body: response
    })
  } catch (error) {
    return handleError(error)
  }
}

export const getPointsByType: Handler = async (event: APIGatewayProxyEvent) => {
  try {
    const PLAYER_POINTS_TABLE = process.env.PLAYER_POINTS_TABLE
    const type = event.pathParameters?.type && Number(event.pathParameters.type)
    console.log('type: ',type)
    if(type < 0)  return apiResult({statusCode: 400, body: 'Type is required'})
    const params = {
      TableName: PLAYER_POINTS_TABLE,
      IndexName: 'player_point_type_index',
      KeyConditionExpression: '#type=:type',
      ExpressionAttributeValues: {
        ':type': type
      },
      ExpressionAttributeNames: {
        '#type': 'type'
      }
    }
    const response = await dynamoDBService.getPointsByType(params as QueryInput)
    return apiResult({statusCode: 200, body: response})
  } catch (error) {
    return handleError(error)
  }
}

const handleError = (error: Error) => {
  // Log.error(error.message || "error: ", error);
  return apiResult({statusCode : error["statusCode"] || 500, body: {
    message: error.message || "unknown error",
  }});
};
