import { dynamoDBService, s3Service } from "../services"
import * as handler from '../handler'

describe('handler', () => {
    afterAll(() => jest.clearAllMocks)
    describe('getS3PostPresignedUploadFile', () => {
        it('should return 400 if user not pass bucket type or file name', async () => {
            const params = {
                fileName: 'epilot.jpeg'
            }
            const expectedIntance = {
                statusCode: 400,
                body: "Invalid bucket type or file name",
            }
            jest.spyOn(s3Service, 'getS3PostPresignedUploadFile')
            .mockImplementation(() => {
                return null
            })
            const response = await handler.getS3PostPresignedUploadFile(params, null, null)
            expect(response).toHaveBeenCalledTimes(1)
            expect(response).toMatchSnapshot()
            expect(response).toEqual(expectedIntance)
        })
        it('should return 200 if user pass bucket type and file name valid', async() => {
            const params = {
                bucketName: 'uploadFileName',
                fileName: 'epilot.jpeg'
            }
            jest.spyOn(s3Service, 'getS3PostPresignedUploadFile')
            .mockImplementation(() => {
                return {
                    url: "https://s3.ap-southeast-1.amazonaws.com/uploadfilename",
                    fields: {
                        key: "epilot.jpeg",
                        bucket: "uploadFileName",
                        "X-Amz-Signature": "",
                        Policy: ''
                    }
                }
            })
            const response = await handler.getS3PostPresignedUploadFile(params, null, null)
            expect(response).toHaveBeenCalledTimes(1)
            expect(response).toMatchSnapshot()
            expect(response).toHaveProperty("url")
        })
    })

    describe('getPoint', () => {
        it('should return 400 if ID is not passing in the request', async() => {
            const params = {
                TableName: 'player-points'
            }
            const expectedInstance = {
                statusCode: 400,
                body: 'ID is required'
            }
            jest.spyOn(dynamoDBService, 'getPoint')
            .mockImplementation(() => {return null})
            const response = await handler.getPoint(params, null, null)
            expect(response).toHaveBeenCalledTimes(1)
            expect(response).toEqual(expectedInstance)
            expect(response).toMatchSnapshot()
        })
        it('should return 200 if ID is valid', async() => {
            const params = {
                TableName: 'player-points',
                Key: {
                    ID: "1"
                }
            }
            jest.spyOn(dynamoDBService, 'getPoint')
            .mockImplementation(() => {
                return Promise.resolve({
                    Item: {
                        ID: "1",
                        firstName: "Minh",
                        lastName: "Nguyen",
                        age: 29
                    }

                })
            })
            const response = await handler.getPoint(params, null, null)
            expect(response).toHaveBeenCalledTimes(1)
            expect(response).toMatchSnapshot()
        })
    })
})