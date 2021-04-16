import * as AWS from "aws-sdk";
import { Handler } from "aws-lambda";
import { HandlerResponse } from "../../../src/handlers/createAuction.js";

const ses = new AWS.SES({ region: "eu-west-1" });

export const handler: Handler<any, any> = async (event, context) => {
  const record = event.Records[0];

  const email = JSON.parse(record.body);
  const { subject, body, recipient } = email;

  const params = {
    Source: "mordigold97@gmail.com",
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};
