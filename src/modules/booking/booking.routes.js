import { Router } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../auth/auth.js";

import {
  createBooking,
  getAllBookings,
  getBookingById,
  confirmBooking,
} from "./booking.controller.js";

const router = Router();

const requireAuth = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

  
    req.user = session.user;

    next();
  } catch (error) {
    next(error);
  }
};


router.post("/", requireAuth, createBooking);
router.get("/", requireAuth, getAllBookings);
router.get("/:id", requireAuth, getBookingById);
router.patch("/:id/confirm", requireAuth, confirmBooking);

export default router;