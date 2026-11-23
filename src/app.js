import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { httpLogger } from "./logger/logger.js";
import { auth } from "./auth/auth.js";
import { responseLogger } from "./middleware/responseLogger.middleware.js";

const app = express();
app.use(httpLogger);
app.use(responseLogger);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Workshop Seat Booking API is running",
  });
});

export default app;
