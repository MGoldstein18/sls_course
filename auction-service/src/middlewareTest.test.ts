import * as Joi from "joi";

const validationTest = require("./schemaValidationMiddleware.ts");

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
  expect(validationTest({ value: open, schema: schema })).toMatchObject({
    before: expect.any(Function),
    onError: expect.any(Function),
  });
});

test('validates "CLOSED"', () => {
  expect(validationTest({ value: closed, schema: schema })).toMatchObject({
    before: expect.any(Function),
    onError: expect.any(Function),
  });
});

test("throws error for not a string", () => {
  expect(validationTest({ value: notString, schema: schema })).toMatchObject({
    before: expect.any(Function),
    onError: expect.any(Function),
  });
});

test("throws error for not valid", () => {
  expect(validationTest({ value: notValid, schema: schema })).toMatchObject({
    before: expect.any(Function),
    onError: expect.any(Function),
  });
});

test("throws error for not present", () => {
  expect(validationTest({ value: notPresent, schema: schema })).toMatchObject({
    before: expect.any(Function),
    onError: expect.any(Function),
  });
});


