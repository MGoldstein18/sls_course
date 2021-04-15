import { v4 as uuid } from "uuid";
import * as AWS from "aws-sdk";
import * as createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";
import { Handler } from "aws-lambda";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export interface HandlerResponse{
  statusCode: number;
  body: string;
}

export interface HighestBid {
  amount: number;
  bidder?: string;
}

export interface Auction {
  id?: string;
  title?: string;
  status?: string;
  createdAt?: string;
  endingAt?: string;
  highestBid?: HighestBid;
  seller?: string;
}

const originalHandler: Handler<any, HandlerResponse> = async (event, context) => {
  const title: string = event.body.title;
  const now: Date = new Date();
  const endDate: Date = new Date();
  endDate.setHours(now.getHours() + 1);

  const {email}:{email: string} = event.requestContext.authorizer;

  const auction: Auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
    seller: email,
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(originalHandler);
