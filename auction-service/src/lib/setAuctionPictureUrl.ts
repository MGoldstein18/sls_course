import * as AWS from "aws-sdk";
import { PicUrl } from "../handlers/uploadAuctionPicture.js";

type setAuctionPicUrl = (id: string, pictureUrl: PicUrl) => any;

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const setAuctionPictureUrl: setAuctionPicUrl = async (
  id,
  pictureUrl
) => {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set pictureUrl = :pictureUrl",
    ExpressionAttributeValues: {
      ":pictureUrl": pictureUrl,
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamodb.update(params).promise();
  return result.Attributes;
};
