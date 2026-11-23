
import { logger } from "../logger/logger.js";

export const responseLogger = (req, res, next) => {

  if (req.originalUrl.startsWith("/api/auth")) {
    return next();
  }

  const originalJson = res.json.bind(res);

  res.json = (body) => {

    res.locals.responseBody = body;

    return originalJson(body);
  };

  res.on("finish", () => {
    if (res.locals.responseBody === undefined) return;

    logger.info(
      {
        requestId: req.id,
        responseData: res.locals.responseBody,
      },
      "API response data"
    );
  });

  next();
};
