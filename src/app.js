
import express from "express";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./auth/auth.js";
import workshopRoutes from "./modules/workshops/workshop.routes.js";

const app = express();


app.all("/api/auth/*splat", toNodeHandler(auth));


app.use(express.json());


app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Workshop Booking API is running",
  });
});


app.use("/api/v1/workshop", workshopRoutes);

export default app;
