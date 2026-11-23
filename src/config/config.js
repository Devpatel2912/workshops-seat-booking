
import "dotenv/config";

const config = {
  app: {
    name: process.env.APP_NAME || "Workshop Seat Booking",
    env: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 5000,
    apiPrefix: process.env.API_PREFIX || "/api",
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  logger: {
    level: process.env.LOG_LEVEL || "info",
    service: process.env.SERVICE_NAME || "workshop-seat-booking",
  },

  auth: {
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.BETTER_AUTH_URL,
  },
};

export default config;
