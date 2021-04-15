import { closeAuctions } from "../lib/closeAuction.js";
import { getEndedAuctions } from "../lib/getEndedAuctions.js";
import * as createError from "http-errors";
import { Handler } from "aws-lambda";

export const handler: Handler<any, object> = async (event, context) => {
  try {
    const auctionsToClose: Array<object> = await getEndedAuctions();

    const closePromises: Array<object> = auctionsToClose.map((auction) =>
      closeAuctions(auction)
    );

    await Promise.all(closePromises);

    return { closed: closePromises.length };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
};
