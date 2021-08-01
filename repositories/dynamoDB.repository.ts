import { GetItemInput, PutItemInput, QueryInput, UpdateItemInput } from "aws-sdk/clients/dynamodb"
import { getDynamoDBClient } from "../dynamoDB/dynamoDB-client"

export const getPoint = async (params: GetItemInput) => {
    try {
        const response = await getDynamoDBClient().get(params).promise()
        return response
    } catch (error) {
        throw error
    }
}

export const createPoint = async (params: PutItemInput) => {
    try {
        const response = await getDynamoDBClient().put(params).promise()
        return response
    } catch (error) {
        throw error
    }
}

export const updatePoint = async(params: UpdateItemInput) => {
    try {
        const response = await getDynamoDBClient().update(params).promise()
        return response
        
    } catch (error) {
        throw error
    }
}

export const getPointsByType = async (params: QueryInput) => {
    try {
        const response = await getDynamoDBClient().query(params).promise()
        return response
        
    } catch (error) {
        throw error
    }

}