const Joi = require("joi");

function validationFunction(value, schema) {
  const error = Joi.assert(value, schema);
  return error;
}

module.exports = validationFunction;
