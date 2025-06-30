import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();

// Create redisClient client
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: {},
});

redisClient.on("connect", () => {
  console.log("✅ redisClient connected");
});

redisClient.on("error", (err) => {
  console.error("❌ redisClient error:", err);
});

export default redisClient;
