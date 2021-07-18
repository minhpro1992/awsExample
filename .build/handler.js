"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getS3PresignedURL = exports.getS3PostPresignedUploadFile = exports.hello = void 0;
var bucket_type_1 = require("./enums/bucket-type");
var s3_client_1 = require("./s3/s3-client");
var hello = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Go Serverless v1.0! Your function executed successfully!",
                    input: event,
                }, null, 2),
            }];
    });
}); };
exports.hello = hello;
var getS3PostPresignedUploadFile = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, bucketType, fileName, bucketName, params, uploadUrl;
    var _b;
    return __generator(this, function (_c) {
        _a = event.queryStringParameters, bucketType = _a.bucketType, fileName = _a.fileName;
        console.log("query value: ", bucketType, fileName);
        bucketName = (_b = bucket_type_1.default.fromType(bucketType)) === null || _b === void 0 ? void 0 : _b.bucketName;
        try {
            if (bucketName && fileName) {
                params = {
                    Bucket: bucketName,
                    Fields: {
                        key: fileName,
                    },
                };
                uploadUrl = s3_client_1.getS3Client().createPresignedPost(params);
                return [2 /*return*/, {
                        statusCode: 200,
                        body: uploadUrl,
                    }];
            }
            else {
                return [2 /*return*/, {
                        statusCode: 400,
                        body: "Invalid bucket type or file name",
                    }];
            }
        }
        catch (error) {
            return [2 /*return*/, handleError(error)];
        }
        return [2 /*return*/];
    });
}); };
exports.getS3PostPresignedUploadFile = getS3PostPresignedUploadFile;
var getS3PresignedURL = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, bucketType, fileName, bucketName, params, s3Url, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = event.queryStringParameters, bucketType = _a.bucketType, fileName = _a.fileName;
                bucketName = (_b = bucket_type_1.default.fromType(bucketType)) === null || _b === void 0 ? void 0 : _b.bucketName;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 5, , 6]);
                if (!(bucketName && fileName)) return [3 /*break*/, 3];
                params = {
                    Bucket: bucketName,
                    Key: fileName,
                };
                return [4 /*yield*/, s3_client_1.getS3Client().getSignedUrlPromise("getObject", params)];
            case 2:
                s3Url = _c.sent();
                console.log("s3Url: ", s3Url);
                return [2 /*return*/, {
                        statusCode: 200,
                        body: s3Url,
                    }];
            case 3: return [2 /*return*/, {
                    statusCode: 400,
                    body: "Invalid bucket type or file name",
                }];
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _c.sent();
                return [2 /*return*/, handleError(error_1)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getS3PresignedURL = getS3PresignedURL;
var handleError = function (error) {
    return apiResult(error["statusCode"] || 500, {
        message: error.message || "unknown error",
    });
};
//# sourceMappingURL=handler.js.map