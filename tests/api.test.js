
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import express from "express";

import requestId from "../src/middleware/requestId.js";
import errorHandler from "../src/middleware/errorHandler.js";
import ApiError from "../src/utils/ApiError.js";
import ApiResponse from "../src/utils/ApiResponse.js";

const app = express();

app.use(requestId);
app.use(express.json());


app.get("/test-success", (req, res) => {
  return res.status(200).json(
    ApiResponse(req, {
      message: "API working successfully",
    }),
  );
});


app.get("/test-error", (req, res, next) => {
  next(
    new ApiError(
      404,
      "TEST_NOT_FOUND",
      "Test resource not found",
    ),
  );
});


app.use(errorHandler);

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);

  await new Promise((resolve) => {
    server.once("listening", resolve);
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
});

test("GET /test-success should return response envelope", async () => {
  const response = await fetch(`${baseUrl}/test-success`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.data.message, "API working successfully");
  assert.ok(body.meta.request_id);
  assert.equal(
    response.headers.get("x-request-id"),
    body.meta.request_id,
  );
});

test("GET /test-error should return error envelope", async () => {
  const response = await fetch(`${baseUrl}/test-error`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.error.code, "TEST_NOT_FOUND");
  assert.equal(body.error.msg, "Test resource not found");
  assert.ok(body.error.request_id);
});
