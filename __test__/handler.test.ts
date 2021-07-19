import { s3Service } from "../services"
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
})