import { ValidationError } from "../../common/error/ApiError.js";
import { validateDateAndTime } from "./workshop.service.js";
import { workshopErrorCodes } from "./error.js";
import ApiError from "../../common/error/ApiError.js";

export const createWorkshopValidation = (req, res, next) => {
  const { title, eventDate, startTime, endTime, seatLimit, location, fees } = req.body;

  if (
    !title?.trim() ||
    !eventDate ||
    !startTime ||
    !endTime ||
    !location?.trim() ||
    seatLimit === undefined ||
    fees === undefined
  ) {
    throw new ValidationError("All Field are required.");
  }

  if (!Number.isInteger(seatLimit) || seatLimit <= 0) {
    throw new ApiError(
      400,
      workshopErrorCodes.positiveInteger,
      "Seat limit must be a positive integer",
    );
  }

  if (!Number.isFinite(Number(fees)) || Number(fees) < 0) {
    throw new ApiError(400, workshopErrorCodes.invalidFees, "Fees cannot be negative");
  }

  const { date, start, end } = validateDateAndTime(eventDate, startTime, endTime);

  req.body.date = date;
  req.body.start = start;
  req.body.end = end;

  next();
};
