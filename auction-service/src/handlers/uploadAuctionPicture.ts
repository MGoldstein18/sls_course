import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import * as createError from "http-errors";
import { getAuctionById } from "./getAuction.js";
import { uploadPictureToS3 } from "../lib/uploadPictureToS3.js";
import { setAuctionPictureUrl } from "../lib/setAuctionPictureUrl.js";
import { Handler } from "aws-lambda";
import { HandlerResponse, Auction } from "./createAuction.js";

export interface PicUrl{
  Location?: string;
}

const originalHandler: Handler<any, HandlerResponse> = async (event) => {
  const { id }: { id: string } = event.pathParameters;

  const auction: Auction = getAuctionById(id);

  const { email }: { email: string } = event.requestContext.authorizer;

  if (auction.seller !== email) {
    throw new createError.Forbidden("You are not the seller of this auction");
  }

  const base64: string = event.body.replace(/^data:image\/\w+;base64,/, "");

  const buffer = Buffer.from(base64, "base64");

  let updatedAuction: Auction;

  try {
    const pictureUrl = await uploadPictureToS3(auction.id + ".jpg", buffer.toString());
    updatedAuction = await setAuctionPictureUrl(
      auction.id,
      pictureUrl.Location
    );
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
};

export const handler = middy(originalHandler)
  .use(httpErrorHandler())
  .use(cors());
