import prisma from "../../config/prisma.js";
import ApiError from "../../common/error/ApiError.js";
import { workshopErrorCodes } from "./error.js";


const parseTime = (value) => {
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    throw new ApiError(400, workshopErrorCodes.invalidTime, "Invalid time format. Use HH:mm");
  }

  return new Date(`1970-01-01T${value}:00.000Z`);
};


const formatTime = (value) => {
  return value.toISOString().slice(11, 16);
};


export const validateDateAndTime = (startTime, endTime) => {
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  if (end <= start) {
    throw new ApiError(
      400,
      workshopErrorCodes.invalidTimeRange,
      "End time must be later than start time",
    );
  }

  return { start, end };
};


export const createWorkshop = async (data) => {
  const { title, seatLimit, location, start, end } = data;

  return prisma.workshop.create({
    data: {
      title: title.trim(),
      startTime: start,
      endTime: end,
      seatLimit,
      availableSeats: seatLimit,
      location: location.trim(),
    },
  });
};



export const getAllWorkshops = async (query = {}) => {
  
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);

  
  if (!Number.isInteger(page) || page < 1) {
    throw new ApiError(
      400,
      workshopErrorCodes.validationError,
      "Page must be a positive integer",
    );
  }

 
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new ApiError(
      400,
      workshopErrorCodes.validationError,
      "Limit must be between 1 and 100",
    );
  }

  const skip = (page - 1) * limit;

  const [workshops, totalRecords] = await Promise.all([
    prisma.workshop.findMany({
      skip,
      take: limit,
      orderBy: [
        { startTime: "asc" },
        { id: "asc" },
      ],
    }),

    prisma.workshop.count(),
  ]);

  const totalPages = Math.ceil(totalRecords / limit);

  return {
    items: workshops,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalRecords,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1 && totalPages > 0,
    },
  };
};


// Get workshop by ID
export const getWorkshopById = async (id) => {
  if (!id) {
    throw new ApiError(400, workshopErrorCodes.invalidId, "Workshop ID is required");
  }

  const workshop = await prisma.workshop.findUnique({
    where: { id },
  });

  if (!workshop) {
    throw new ApiError(404, workshopErrorCodes.notFound, "Workshop not found");
  }

  return workshop;
};

// Update workshop
export const updateWorkshop = async (id, data) => {
  if (!id) {
    throw new ApiError(400, workshopErrorCodes.invalidId, "Workshop ID is required");
  }

  const existingWorkshop = await prisma.workshop.findUnique({
    where: { id },
  });

  if (!existingWorkshop) {
    throw new ApiError(404, workshopErrorCodes.notFound, "Workshop not found");
  }

  const { title, startTime, endTime, seatLimit, location } = data;

  // Validate title
  if (title !== undefined && !title.trim()) {
    throw new ApiError(400, workshopErrorCodes.requiredTitle, "Workshop title cannot be empty");
  }

  // Validate location
  if (location !== undefined && !location.trim()) {
    throw new ApiError(
      400,
      workshopErrorCodes.requiredLocation,
      "Workshop location cannot be empty",
    );
  }

  // Validate seat limit
  const newSeatLimit = seatLimit ?? existingWorkshop.seatLimit;

  if (!Number.isInteger(newSeatLimit) || newSeatLimit <= 0) {
    throw new ApiError(
      400,
      workshopErrorCodes.positiveInteger,
      "Seat limit must be a positive integer",
    );
  }

  // Calculate already booked seats
  const bookedSeats = existingWorkshop.seatLimit - existingWorkshop.availableSeats;

  if (newSeatLimit < bookedSeats) {
    throw new ApiError(
      409,
      workshopErrorCodes.seatLimitExceeded,
      `Seat limit cannot be less than already booked seats (${bookedSeats})`,
    );
  }

  // Preserve existing times when they are not updated
  const newStartTime = startTime !== undefined ? startTime : formatTime(existingWorkshop.startTime);

  const newEndTime = endTime !== undefined ? endTime : formatTime(existingWorkshop.endTime);

  // Validate updated times
  const { start, end } = validateDateAndTime(newStartTime, newEndTime);

  return prisma.workshop.update({
    where: { id },
    data: {
      ...(title !== undefined && {
        title: title.trim(),
      }),

      startTime: start,
      endTime: end,

      seatLimit: newSeatLimit,

      availableSeats: newSeatLimit - bookedSeats,

      ...(location !== undefined && {
        location: location.trim(),
      }),
    },
  });
};

// Delete workshop
export const deleteWorkshop = async (id) => {
  if (!id) {
    throw new ApiError(400, workshopErrorCodes.invalidId, "Workshop ID is required");
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
    throw new ApiError(404, workshopErrorCodes.notFound, "Workshop not found");
  }

  if (workshop._count.bookings > 0) {
    throw new ApiError(
      409,
      workshopErrorCodes.hasBookings,
      "Cannot delete this workshop because bookings already exist",
    );
  }

  return prisma.workshop.delete({
    where: { id },
  });
};
