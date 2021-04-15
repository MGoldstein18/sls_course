"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auctionsSchema = {
    properties: {
        queryStringParameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['OPEN', 'CLOSED'],
                    default: 'OPEN',
                },
            },
        },
    },
    required: [
        'queryStringParameters',
    ],
};
exports.default = auctionsSchema;
