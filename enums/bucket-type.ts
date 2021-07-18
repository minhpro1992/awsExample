class BucketType {
    public static readonly BUCKET_IMAGE = new BucketType(
        0,
        'uploadfilename',
        'image/',
        [0,10]
    )
    private constructor (
        public readonly type: number,
        public readonly bucketName: string,
        public readonly contentType: string,
        public readonly sizeRange: number[]

    ){}
    public static readonly ALL_BUCKETS: BucketType[] = [
        BucketType.BUCKET_IMAGE
    ]

    static fromType = (type: number): BucketType => {
        for(const bucketType of BucketType.ALL_BUCKETS) {
            if(bucketType.type === type) {
                return bucketType
            }
        }
        throw new Error('Invalid bucket type')
    }
}

export default BucketType
