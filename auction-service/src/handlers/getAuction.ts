import * as AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware.js";
import * as createError from "http-errors";
import { Handler } from "aws-lambda";
import { HandlerResponse } from "./createAuction.js";

type getFunction = (a: string) => object;

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const getAuctionById: getFunction = async (id) => {
  let auction: object;

  try {
    const result = await dynamodb
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    auction = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with ID ${id} was not found!`);
  }

  return auction;
};

const originalHandler: Handler<any, HandlerResponse> = async (
  event,
  context
) => {
  const { id }: { id: string } = event.pathParameters;
  const auction: object = getAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
};

export const handler = commonMiddleware(originalHandler);
