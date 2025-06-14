import axios from "axios";
import fs from "fs";
import path from "path";
import redisClient from "../redisClient.js";

export const downloadFile = async (fileUrl) => {
  const fileName = path.basename(fileUrl);
  const tempDir = path.resolve("temp");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const tempFilePath = path.join(tempDir, fileName);

  // Check Redis cache
  const cachedPath = await redisClient.get(fileUrl);
  if (cachedPath && fs.existsSync(cachedPath)) {
    return cachedPath; // Use cached path
  }

  // Download file
  const response = await axios.get(fileUrl, { responseType: "stream" });
  const writer = fs.createWriteStream(tempFilePath);

  await new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  // Store in Redis with TTL (e.g., 10 minutes)
  await redisClient.set(fileUrl, tempFilePath, { EX: 600 });

  return tempFilePath;
};
