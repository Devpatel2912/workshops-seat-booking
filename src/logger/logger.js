
import "dotenv/config";
import { randomUUID } from "node:crypto";
import pino from "pino";
import pinoHttp from "pino-http";
import config from "../config/config.js";

export const logger = pino({
  level: config.logger.level,

  messageKey: "message",

  base: {
    service: config.logger.service,
    env: config.app.env,
  },

  formatters: {
    level(label) {
      return { level: label };
    },
  },

  timestamp: pino.stdTimeFunctions.isoTime,
});


export const httpLogger = pinoHttp({
  logger,

  genReqId: () => randomUUID(),

  customProps(req) {
    return {
      requestId: req.id,
    };
  },

  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
      };
    },

    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },

  customLogLevel(req, res, err) {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
});

