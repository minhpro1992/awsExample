import * as arranger from './test-arranger'

describe.skip("s3 client", () => {
 beforeAll(() => {
     jest.mock('aws-sdk', () => arranger.mockAWSService('S3'))
 })
 describe('getS3Client', () => {
    const expectedInstance = { name: 'S3MockInstance'}
    const constructorMock = jest.fn(() => expectedInstance)
    arranger.mockAWSService('S3', () => constructorMock)
    it('Shoud return aws-sdk S3 instance', async () => {
        const {getS3Client} = await import('../s3/s3-client')
        const response =  getS3Client();
        expect(constructorMock).toBeCalledTimes(1)
        expect(response).toEqual(expectedInstance)
    })

})
})