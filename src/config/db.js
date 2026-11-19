
// import pg from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// const { Pool } = pg;

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 5000,
// });

// pool.on("error", (error) => {
//   console.error("Unexpected PostgreSQL error:", error);
// });

// export const connectDB = async () => {
//   try {
//     const client = await pool.connect();

//     console.log("PostgreSQL connected successfully");

//     client.release();
//   } catch (error) {
//     console.error("Database connection failed:", error.message);
//     throw error;
//   }
// };

// export default pool;
