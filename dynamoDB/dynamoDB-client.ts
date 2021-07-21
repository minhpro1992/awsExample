import * as AWS from 'aws-sdk'

export const getDynamoDBClient = (() => {
    let client: AWS.DynamoDB
    return () => {
        if(!client) {
            client = new AWS.DynamoDB.DocumentClient()
        }
        return client

    }
})()