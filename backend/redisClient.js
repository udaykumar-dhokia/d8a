// redisClientClient.js
import dotenv from "dotenv";
import Redis from "ioredis";

// Load env variables
dotenv.config();

// Create redisClient client
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: {}, // Required for Upstash (redisClients://)
});

// Optional: Log connection status
redisClient.on("connect", () => {
  console.log("✅ redisClient connected");
});

redisClient.on("error", (err) => {
  console.error("❌ redisClient error:", err);
});

export default redisClient;
