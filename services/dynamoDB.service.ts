import { UpdateItemInput } from "aws-sdk/clients/dynamodb";
import { getDynamoDBClient } from "../dynamoDB/dynamoDB-client";
import { PointType } from "../types";

export const getPoint = async (params: {
    TableName: string,
    Key: {
        ID: string
    }
}) => {
    if(params?.TableName && params.Key?.ID) {
        return getDynamoDBClient().get(params).promise()
    }
    return null
}

export const createPoint = async (params: {
    TableName: string,
    Item: PointType
}) => {
    if(params?.TableName) {
        return getDynamoDBClient().put(params).promise()
    }
    return null
}

export const updatePoint = async (params: UpdateItemInput) => {
    if(params?.TableName) {
        return getDynamoDBClient().update(params).promise()
    }
    return null
}