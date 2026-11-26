
import { logger } from "../logger/logger.js";
import { errCodes } from "../common/error/codes.js";

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;

  const code =
    err.code || errCodes.internalServerError;

  const message =
    statusCode >= 500
      ? "Internal server error"
      : err.message || "Something went wrong";

  logger.error(
    {
      err,
      request_id: req.id,
      statusCode,
    },
    "API request failed"
  );

  const error = {
    code,
    msg: message,
    request_id: req.id,
  };

  if (Array.isArray(err.details) && err.details.length > 0) {
    error.details = err.details;
  }

  return res.status(statusCode).json({ error });
};

export default errorHandler;
