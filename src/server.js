import dotenv from "dotenv";
dotenv.config();
import { logger } from "./logger/logger.js";
import app from "./app.js";
import prisma from "./config/prisma.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();

    logger.info("Database connected successfully");

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Server startup failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

const shutdown = async () => {
  logger.info("Shutting down server...");

  await prisma.$disconnect();

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
