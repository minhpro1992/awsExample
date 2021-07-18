"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getS3Client = void 0;
var AWS = require("aws-sdk");
exports.getS3Client = (function () {
    var client;
    return function () {
        if (!client) {
            client = new AWS.S3({});
        }
        return client;
    };
})();
//# sourceMappingURL=s3-client.js.map