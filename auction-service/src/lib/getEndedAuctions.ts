import * as AWS from "aws-sdk";

type getEndedFunction = () => Promise<AWS.DynamoDB.DocumentClient.ItemList>;

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const getEndedAuctions: getEndedFunction = async () => {
  const now: Date = new Date();

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status AND endingAt <= :now",
    ExpressionAttributeValues: {
      ":status": "OPEN",
      ":now": now.toISOString(),
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  const result = await dynamodb.query(params).promise();
  return result.Items;
};
