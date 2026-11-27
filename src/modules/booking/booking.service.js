
import prisma from "../../config/prisma.js";
import ApiError from "../../common/error/ApiError.js";
import { bookingError } from "./booking.error.js";

const BOOKING_LOCK_TIME = 2 * 60 * 1000;

const processExpiredBookings = async (tx) => {
  const now = new Date();

  const expiredBookings = await tx.booking.findMany({
    where: {
      status: "PENDING",
      expiresAt: {
        lte: now,
      },
    },
    select: {
      id: true,
      workshopId: true,
      totalSeats: true,
    },
  });

  let releasedCount = 0;

  for (const booking of expiredBookings) {
    const result = await tx.booking.updateMany({
      where: {
        id: booking.id,
        status: "PENDING",
        expiresAt: {
          lte: now,
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    if (result.count === 1) {
      await tx.workshop.update({
        where: {
          id: booking.workshopId,
        },
        data: {
          availableSeats: {
            increment: booking.totalSeats,
          },
        },
      });

      releasedCount++;
    }
  }

  return releasedCount;
};

export const releaseExpiredBookings = async (tx = null) => {
  if (tx) {
    return processExpiredBookings(tx);
  }

  return prisma.$transaction(async (transaction) => {
    return processExpiredBookings(transaction);
  });
};

export const createBooking = async ({
  name,
  email,
  phone,
  totalSeats,
  workshopId,
}) => {
  return prisma.$transaction(async (tx) => {
    await releaseExpiredBookings(tx);

    const workshop = await tx.workshop.findUnique({
      where: {
        id: workshopId,
      },
    });

    if (!workshop) {
      throw new ApiError(
        404,
        "Workshop not found",
        bookingError.workshopNotFound,
      );
    }

    if (!Number.isInteger(totalSeats) || totalSeats < 1) {
      throw new ApiError(400, "Invalid seat quantity", "validation_error");
    }

    const existingBooking = await tx.booking.findFirst({
      where: {
        email,
        workshopId,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });

    if (existingBooking) {
      throw new ApiError(
        409,
        "Booking already exists",
        bookingError.bookingAlreadyExists,
      );
    }

    const seatReserved = await tx.workshop.updateMany({
      where: {
        id: workshopId,
        availableSeats: {
          gte: totalSeats,
        },
      },
      data: {
        availableSeats: {
          decrement: totalSeats,
        },
      },
    });

    if (seatReserved.count === 0) {
      throw new ApiError(
        409,
        "Not enough seats available",
        bookingError.noSeatsAvailable,
      );
    }

    const expiresAt = new Date(Date.now() + BOOKING_LOCK_TIME);

    return tx.booking.create({
      data: {
        name,
        email,
        phone,
        totalSeats,
        workshopId,
        status: "PENDING",
        expiresAt,
      },
      include: {
        workshop: true,
      },
    });
  });
};

export const getAllBookings = async (email, isOrganizer = false) => {
  await releaseExpiredBookings();

  return prisma.booking.findMany({
    where: isOrganizer ? {} : { email },
    include: {
      workshop: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getBookingById = async (
  bookingId,
  email,
  isOrganizer = false,
) => {
  await releaseExpiredBookings();

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      workshop: true,
    },
  });

  if (!booking) {
    throw new ApiError(
      404,
      "Booking not found",
      bookingError.bookingNotFound,
    );
  }

  if (!isOrganizer && booking.email !== email) {
    throw new ApiError(403, "You cannot access this booking", "access_denied");
  }

  return booking;
};

export const confirmBooking = async (
  bookingId,
  email,
  isOrganizer = false,
) => {
  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      return { error: "NOT_FOUND" };
    }

    if (!isOrganizer && booking.email !== email) {
      return { error: "ACCESS_DENIED" };
    }

    if (booking.status === "CONFIRMED") {
      return { error: "ALREADY_CONFIRMED" };
    }

    if (
      booking.status !== "PENDING" ||
      !booking.expiresAt ||
      booking.expiresAt <= new Date()
    ) {
      return { error: "EXPIRED" };
    }

    const updated = await tx.booking.updateMany({
      where: {
        id: bookingId,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        status: "CONFIRMED",
        expiresAt: null,
      },
    });

    if (updated.count === 0) {
      return { error: "EXPIRED" };
    }

    const confirmedBooking = await tx.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        workshop: true,
      },
    });

    return {
      booking: confirmedBooking,
    };
  });

  if (result.error === "NOT_FOUND") {
    throw new ApiError(
      404,
      "Booking not found",
      bookingError.bookingNotFound,
    );
  }

  if (result.error === "ACCESS_DENIED") {
    throw new ApiError(403, "You cannot confirm this booking", "access_denied");
  }

  if (result.error === "ALREADY_CONFIRMED") {
    throw new ApiError(
      409,
      "Booking already confirmed",
      bookingError.bookingAlreadyConfirmed,
    );
  }

  if (result.error === "EXPIRED") {
    await releaseExpiredBookings();

    throw new ApiError(
      409,
      "Booking expired. Please book again.",
      bookingError.bookingExpired,
    );
  }

  return result.booking;
};
