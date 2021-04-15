import * as AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware.js";
import * as createError from "http-errors";
import { getAuctionById } from "./getAuction.js";
import { Handler } from "aws-lambda";
import { HandlerResponse, Auction } from "./createAuction.js";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const originalHandler: Handler<any, HandlerResponse> = async (
  event,
  context
) => {
  const { id }: { id: string } = event.pathParameters;
  const { amount }: { amount: number } = event.body;

  const auction: Auction = getAuctionById(id);

  const { email }: { email: string } = event.requestContext.authorizer;

  if (email === auction.seller) {
    throw new createError.Forbidden("You may not bid on your own auctions!");
  }

  if (email === auction.highestBid.bidder) {
    throw new createError.Forbidden("You are already the highest bidder!");
  }

  if (auction.status !== "OPEN") {
    throw new createError.Forbidden("You may not bid on a closed auction!");
  }

  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(
      `Your bid must be higher than ${auction.highestBid.amount}!`
    );
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression:
      "set highestBid.amount = :amount, highestBid.bidder = :bidder",
    ExpressionAttributeValues: {
      ":amount": amount,
      ":bidder": email,
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedAuction;

  try {
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
};

export const handler = commonMiddleware(originalHandler);
