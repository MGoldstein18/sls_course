"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema = {
    properties: {
        body: {
            type: 'string',
            minLength: 1,
            patter: '\=$'
        }
    },
    required: ['body']
};
exports.default = schema;
