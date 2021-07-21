import { GetItemInput } from "aws-sdk/clients/dynamodb";
import { getDynamoDBClient } from "../dynamoDB/dynamoDB-client";

export const getPoints = async (params: GetItemInput) => {
    if(params?.TableName) {
        return getDynamoDBClient().get(params).promise()
    }
    return null
}