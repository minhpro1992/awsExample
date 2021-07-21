"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BucketType = /** @class */ (function () {
    function BucketType(type, bucketName, contentType, sizeRange) {
        this.type = type;
        this.bucketName = bucketName;
        this.contentType = contentType;
        this.sizeRange = sizeRange;
    }
    BucketType.BUCKET_IMAGE = new BucketType(0, process.env.BUCKET_NAME, 'image/', [0, 10]);
    BucketType.ALL_BUCKETS = [
        BucketType.BUCKET_IMAGE
    ];
    BucketType.fromType = function (type) {
        for (var _i = 0, _a = BucketType.ALL_BUCKETS; _i < _a.length; _i++) {
            var bucketType = _a[_i];
            if (bucketType.type === type) {
                return bucketType;
            }
        }
        throw new Error('Invalid bucket type');
    };
    return BucketType;
}());
exports.default = BucketType;
//# sourceMappingURL=bucket-type.js.map