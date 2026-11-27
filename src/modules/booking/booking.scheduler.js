import cron from "node-cron";
import { releaseExpiredBookings } from "./booking.service.js";
import { logger } from "../../logger/logger.js";

export const startBookingScheduler = () => {
  cron.schedule("*/10 * * * * *", async () => {
    try {
      await releaseExpiredBookings();
    } catch (error) {
      logger.error(
        { err: error },
        "Failed to release expired bookings",
      );
    }
  });
};