
import express from "express";
import { toNodeHandler } from "better-auth/node";
import errorHandler from "./middleware/error.middleware.js";
import { auth } from "./auth/auth.js";
import workshopRoutes from "./modules/workshops/workshop.routes.js";
import requestId from "./middleware/requestId.js";
import bookingRoutes from "./modules/booking/booking.routes.js";

const app = express();

app.use(express.json());
app.use(requestId)
app.all("/api/auth/*splat", toNodeHandler(auth));


app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Workshop Booking API is running",
  });
});


app.use("/api/v1/workshop", workshopRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use(errorHandler);

export default app;
