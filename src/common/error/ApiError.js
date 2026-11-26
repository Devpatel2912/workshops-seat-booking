
import { errCodes } from "./codes.js";

class ApiError extends Error {
  constructor(statusCode, code, message, details = null) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;

    if (Array.isArray(details) && details.length > 0) {
      this.details = details;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends ApiError {
  constructor(message, details = null) {
    super(400, errCodes.validationError, message, details);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Authentication required") {
    super(401, errCodes.unauthorized, message);
  }
}

export class AccessDeniedError extends ApiError {
  constructor(message = "Access denied") {
    super(403, errCodes.accessDenied, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(404, errCodes.notFound, message);
  }
}

export default ApiError;
