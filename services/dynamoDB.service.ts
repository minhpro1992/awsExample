import { GetItemInput, PutItemInput, QueryInput, UpdateItemInput } from "aws-sdk/clients/dynamodb";
import { getDynamoDBClient } from "../dynamoDB/dynamoDB-client";
import { DynamoDBRepository } from "../repositories";
import { PointType } from "../types";

export const getPoint = async ({TableName, ID}: {TableName: string, ID: string
}) => {
    const params = {
      TableName,
      Key: {
        ID
      }
    }
    return DynamoDBRepository.getPoint(params as GetItemInput)
}

export const createPoint = async ({TableName, body}: {
    TableName: string,
    body: PointType
}) => {
    const firstName = body?.firstName
    const lastName = body?.lastName
    const age = body?.age
    const ID = body?.ID
    const params = {
        TableName,
        Item: {
            ID,
            firstName,
            lastName,
            age
        }
    }
    return DynamoDBRepository.createPoint(params as PutItemInput)
}

export const updatePoint = async ({
    TableName,
    body
}: {
    TableName:string,
    body: PointType
}) => {
    const ID = body.ID
    const firstName = body.firstName
    const lastName = body.lastName
    const age = body.age
    const params = {
      TableName,
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
    return DynamoDBRepository.updatePoint(params as UpdateItemInput)
}

export const getPointsByType = async ({TableName, type}: {TableName: string, type: number}) => {
    const params = {
      TableName,
      IndexName: 'player_point_type_index',
      KeyConditionExpression: '#type=:type',
      ExpressionAttributeValues: {
        ':type': type
      },
      ExpressionAttributeNames: {
        '#type': 'type'
      }
    }
    return DynamoDBRepository.getPointsByType(params as QueryInput)
}