import * as Joi from "joi";

const Validator = require("./Validator.ts");

const schema = Joi.object({
  status: Joi.string().valid("OPEN", "CLOSED").required(),
});

const open = {
  status: "OPEN",
};

const closed = {
  status: "CLOSED",
};

const notString = {
  status: 123,
};

const notValid = {
  status: "Not Valid",
};

const notPresent = {
  notStatus: "Where is it?",
};

test('validates "OPEN"', () => {
  expect(() => Validator.validate(open, schema)).not.toBeNull();
});

test('validates "CLOSED"', () => {
  expect(() => Validator.validate(closed, schema)).not.toBeNull();
});

test("throws error for not a string", () => {
  expect(() => Validator.validate(notString, schema)).toThrow();
});

test("throws error for not valid", () => {
  expect(() => Validator.validate(notValid, schema)).toThrow();
});

test("throws error for not present", () => {
  expect(() => Validator.validate(notPresent, schema)).toThrow();
});
