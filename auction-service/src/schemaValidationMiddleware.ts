import * as Joi from "joi";
import * as createError from "http-errors";

const Validator = require("./Validator.ts");

interface RequestObject {
  value: object;
  schema: Joi.ObjectSchema<any>;
}

type validationMiddlewareFunction = () => object;
type customMiddy = (a: RequestObject) => any;

export const schemaValidationMiddleware: validationMiddlewareFunction = () => {
  const customMiddlewareBefore: customMiddy = async (request) => {
    Validator.validate(request.value, request.schema);
    console.log(Validator.validate(request.value, request.schema));
  };
  const customMiddlewareOnError = async (request) => {
    throw new createError.NotAcceptable(
      "Your request did not meet the schema requirements."
    );
  };
  return {
    before: customMiddlewareBefore,
    onError: customMiddlewareOnError,
  };
};

module.exports = schemaValidationMiddleware;
