
import {
  ValidationError,
  default as ApiError,
} from "../../common/error/ApiError.js";

import { validateDateAndTime } from "./workshop.service.js";
import { workshopErrorCodes } from "./error.js";

export const createWorkshopValidation = (req, res, next) => {
  const {
    title,
    startTime,
    endTime,
    seatLimit,
    location,
  } = req.body;

  if (
    !title?.trim() ||
    !startTime ||
    !endTime ||
    !location?.trim() ||
    seatLimit === undefined
  ) {
    throw new ValidationError("All fields are required.");
  }

  if (!Number.isInteger(seatLimit) || seatLimit <= 0) {
    throw new ApiError(
      400,
      workshopErrorCodes.positiveInteger,
      "Seat limit must be a positive integer",
    );
  }

  const { start, end } = validateDateAndTime(
    startTime,
    endTime,
  );

  req.body.start = start;
  req.body.end = end;

  next();
};
