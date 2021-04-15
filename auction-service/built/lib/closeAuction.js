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
exports.closeAuctions = void 0;
var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB.DocumentClient();
var sqs = new AWS.SQS();
var closeAuctions = function (auction) { return __awaiter(void 0, void 0, void 0, function () {
    var params, title, seller, highestBid, amount, bidder, notifySeller, notifyBidder;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = {
                    TableName: process.env.AUCTIONS_TABLE_NAME,
                    Key: { id: auction.id },
                    UpdateExpression: "set #status = :status",
                    ExpressionAttributeValues: {
                        ":status": "CLOSED",
                    },
                    ExpressionAttributeNames: {
                        "#status": "status",
                    },
                };
                return [4 /*yield*/, dynamodb.update(params).promise()];
            case 1:
                _a.sent();
                title = auction.title, seller = auction.seller, highestBid = auction.highestBid;
                amount = highestBid.amount, bidder = highestBid.bidder;
                if (!(amount === 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, sqs
                        .sendMessage({
                        QueueUrl: process.env.MAIL_QUEUE_URL,
                        MessageBody: JSON.stringify({
                            subject: "No bids on your auction item",
                            recipient: seller,
                            body: "Oh no! Your item, " + title + " didn't get any bids.",
                        }),
                    })
                        .promise()];
            case 2:
                _a.sent();
                return [2 /*return*/];
            case 3:
                notifySeller = sqs
                    .sendMessage({
                    QueueUrl: process.env.MAIL_QUEUE_URL,
                    MessageBody: JSON.stringify({
                        subject: "Your item has been sold",
                        recipient: seller,
                        body: "Woohoo! Your item, " + title + " has been sold for $" + amount + ".",
                    }),
                })
                    .promise();
                notifyBidder = sqs
                    .sendMessage({
                    QueueUrl: process.env.MAIL_QUEUE_URL,
                    MessageBody: JSON.stringify({
                        subject: "You won an auction",
                        recipient: bidder,
                        body: "What a great deal! You got yourself a " + title + " for $" + amount + ".",
                    }),
                })
                    .promise();
                return [2 /*return*/, Promise.all([notifySeller, notifyBidder])];
        }
    });
}); };
exports.closeAuctions = closeAuctions;
