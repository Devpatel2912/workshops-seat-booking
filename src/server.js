
import { logger } from "./logger/logger.js";
import app from "./app.js";
import prisma from "./config/prisma.js";
import config from "./config/config.js";

const PORT = config.app.port;

const startServer = async () => {
  try {
    await prisma.$connect();

    logger.info("Database connected successfully");

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`API URL: http://localhost:${PORT}`);
    });

    server.on("error", async (error) => {
      logger.error({ err: error }, `Server failed to start on port ${PORT}`);
      await prisma.$disconnect();
      process.exit(1);
    });
  } catch (error) {
    logger.error({ err: error }, "Server startup failed");

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
