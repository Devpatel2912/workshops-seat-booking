
import { logger } from "../logger/logger.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const code = err.code || "INTERNAL_SERVER_ERROR";

  const message = statusCode >= 500
      ? "Internal server error"
      : err.message || "Something went wrong";

  logger.error(
    {
      err,
      request_id: req.id,
      statusCode,
    },
    "API request failed",
  );

  if (res.headersSent) {
    return next(err);
  }

  return res.status(statusCode).json({
    error: {
      code,
      msg: message,
      request_id: req.id,
      details: err.details || [],
    },
  });
};

export default errorHandler;
