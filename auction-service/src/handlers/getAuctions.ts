import * as AWS from "aws-sdk";
import * as createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware.js";
import { Handler } from "aws-lambda";
import { HandlerResponse } from "./createAuction.js";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const originalHandler: Handler<any, HandlerResponse> = async (
  event,
  context
) => {
  const { status }: { status: string } = event.queryStringParameters;
  let auctions: object;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeValues: {
      ":status": status,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  try {
    const result = await dynamodb.query(params).promise();

    auctions = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
};

export const handler = commonMiddleware(originalHandler);
