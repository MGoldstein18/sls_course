import * as Joi from "joi";

const validationTest = require("./validationFunction.ts");

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
  expect(validationTest(open, schema)).toBe(undefined);
});

test('validates "CLOSED"', () => {
  expect(validationTest(closed, schema)).toBe(undefined);
});

test("throws error for not a string", () => {
  expect(() => validationTest(notString, schema)).toThrow();
});

test("throws error for not valid", () => {
  expect(() => validationTest(notValid, schema)).toThrow();
});

test("throws error for not present", () => {
  expect(() => validationTest(notPresent, schema)).toThrow();
});
