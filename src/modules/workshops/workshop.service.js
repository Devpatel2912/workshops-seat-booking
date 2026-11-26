
import prisma from "../../config/prisma.js";
import ApiError from "../../common/error/ApiError.js";
import { workshopErrorCodes } from "./error.js";

const parseEventDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new ApiError(
    400,
    workshopErrorCodes.invalidDate,
    "Invalid event date. Use YYYY-MM-DD"
  );
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new Error("Invalid event date");
  }

  return date;
};

const parseTime = (value) => {
  if (
    typeof value !== "string" ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)
  ) {
    throw new ApiError(
    400,
    workshopErrorCodes.invalidTime,
    "Invalid time format. Use HH:mm"
  );
  }

  return new Date(`1970-01-01T${value}:00.000Z`);
};

const getToday = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
};

export const validateDateAndTime = (eventDate, startTime, endTime) => {
  const date = parseEventDate(eventDate);
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  if (date < getToday()) {
    throw new Error("Workshop date must be today or in the future");
  }

  if (end <= start) {
    throw new Error("End time must be later than start time");
  }

  return { date, start, end };
};

export const createWorkshop = async (data) => {
  const {
    title,
    seatLimit,
    location,
    fees,
    date,
    end,
    start
  } = data;

  return prisma.workshop.create({
    data: {
      title: title.trim(),
      eventDate: date,
      startTime: start,
      endTime: end,
      seatLimit,
      availableSeats: seatLimit,
      location: location.trim(),
      fees: Number(fees),
    },
  });
};

export const getAllWorkshops = async () => {
  return prisma.workshop.findMany({
    where: {
      eventDate: {
        gte: getToday(),
      },
    },
    orderBy: [
      { eventDate: "asc" },
      { startTime: "asc" },
    ],
  });
};

export const getWorkshopById = async (id) => {
  if (!id) {
    throw new ApiError(
    400,
    workshopErrorCodes.invalidId,
    "Workshop ID is required"
  );
  }

  const workshop = await prisma.workshop.findUnique({
    where: { id },
  });

  if (!workshop) {
    throw new ApiError(
      workshopErrorCodes.notFound,
      "Workshop not found"
    );
  }

  return workshop;
};

export const updateWorkshop = async (id, data) => {
  if (!id) {
    throw new ApiError(
    400,
    workshopErrorCodes.invalidId,
    "Workshop ID is required"
  );
  }

  const existingWorkshop = await prisma.workshop.findUnique({
    where: { id },
  });

  if (!existingWorkshop) {
    throw new ApiError(
      workshopErrorCodes.notFound,
      "Workshop not found"
    );
  }

  const {
    title,
    eventDate,
    startTime,
    endTime,
    seatLimit,
    location,
    fees,
  } = data;

  const newSeatLimit = seatLimit ?? existingWorkshop.seatLimit;

  if (!Number.isInteger(newSeatLimit) || newSeatLimit <= 0) {
    throw new ApiError(
    400,
    workshopErrorCodes.positiveInteger,
    "Seat limit must be a positive integer"
  );
  }

  const bookedSeats =
    existingWorkshop.seatLimit - existingWorkshop.availableSeats;

  if (newSeatLimit < bookedSeats) {
    throw new Error(
      `Seat limit cannot be less than already booked seats (${bookedSeats})`
    );
  }

  const newEventDate =
    eventDate !== undefined
      ? eventDate
      : existingWorkshop.eventDate.toISOString().slice(0, 10);

  const newStartTime =
    startTime !== undefined
      ? startTime
      : existingWorkshop.startTime.toISOString().slice(11, 16);

  const newEndTime =
    endTime !== undefined
      ? endTime
      : existingWorkshop.endTime.toISOString().slice(11, 16);

  const { date, start, end } = validateDateAndTime(
    newEventDate,
    newStartTime,
    newEndTime
  );

  if (
    fees !== undefined &&
    (!Number.isFinite(Number(fees)) || Number(fees) < 0)
  ) {
    throw new ApiError(
  400,
  workshopErrorCodes.invalidFees,
  "Fees cannot be negative"
);
  }

  if (title !== undefined && !title.trim()) {
    throw new ApiError(
  400,
  workshopErrorCodes.requiredTitle,
  "Workshop title cannot be empty"
);
  }

  if (location !== undefined && !location.trim()) {
    throw new ApiError(
  400,
  workshopErrorCodes.requiredLocation,
  "Workshop location cannot be empty"
);
  }

  return prisma.workshop.update({
    where: { id },
    data: {
      ...(title !== undefined && { title: title.trim() }),
      eventDate: date,
      startTime: start,
      endTime: end,
      seatLimit: newSeatLimit,
      availableSeats: newSeatLimit - bookedSeats,
      ...(location !== undefined && {
        location: location.trim(),
      }),
      ...(fees !== undefined && {
        fees: Number(fees),
      }),
    },
  });
};

export const deleteWorkshop = async (id) => {
  if (!id) {
    throw new ApiError(
  400,
  workshopErrorCodes.invalidId,
  "Workshop ID is required"
);
  }

  const workshop = await prisma.workshop.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  });

  if (!workshop) {
    throw new ApiError(
    404,
    workshopErrorCodes.workshopNotFound,
    "Workshop not found"
  );
  }

  if (workshop._count.bookings > 0) {
    throw new ApiError(
    409,
    workshopErrorCodes.hasBookings,
    "Cannot delete this workshop because bookings already exist"
  );
  }

  return prisma.workshop.delete({
    where: { id },
  });
};
