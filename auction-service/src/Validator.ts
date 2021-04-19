import * as Joi from "joi";

export type FactoryFunction<TArgs, TReturn> = TArgs extends any[]
  ? (...args: TArgs) => Readonly<TReturn>
  : (arg?: TArgs) => Readonly<TReturn>;

interface ValidatorParams {}

interface ValidatorInterface {
  validate: (object: any, schema: Joi.ObjectSchema<any>) => void;
}


export const Validator: FactoryFunction<
  ValidatorParams,
  ValidatorInterface
> = () => {
  const validate = (object: any, schema: Joi.ObjectSchema<any>) => {
    Joi.assert(object, schema);
  };

  return Object.freeze({
    validate,
  });
};

const validator = Validator();
validator.validate(
  {
    status: "OPEN",
  },
  Joi.object({
    status: Joi.string().valid("OPEN", "CLOSED").required(),
  })
);

module.exports = Validator;
