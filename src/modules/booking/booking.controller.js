
import {
  createBooking as createBookingService,
  getAllBookings as getAllBookingsService,
  getBookingById as getBookingByIdService,
  confirmBooking as confirmBookingService,
} from "./booking.service.js";

export const createBooking = async (req, res, next) => {
  try {
    const { workshopId, phone, totalSeats } = req.body;

    const booking = await createBookingService({
      name: req.user.name,
      email: req.user.email,
      phone,
      totalSeats,
      workshopId,
    });

    res.status(201).json({
      success: true,
      message: "Booking locked successfully for 2 minutes",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const isOrganizer = req.user.role === "organizer";

    const bookings = await getAllBookingsService(
      req.user.email,
      isOrganizer,
    );

    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const isOrganizer = req.user.role === "organizer";

    const booking = await getBookingByIdService(
      req.params.id,
      req.user.email,
      isOrganizer,
    );

    res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const confirmBooking = async (req, res, next) => {
  try {
    const isOrganizer = req.user.role === "organizer";

    const booking = await confirmBookingService(
      req.params.id,
      req.user.email,
      isOrganizer,
    );

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
