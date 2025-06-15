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
    // Verify the cached file is valid
    const stats = fs.statSync(cachedPath);
    if (stats.size > 0) {
      return cachedPath;
    }
  }

  try {
    // Download file with timeout and validation
    const response = await axios.get(fileUrl, {
      responseType: "stream",
      timeout: 30000, // 30 second timeout
      validateStatus: (status) => status === 200,
    });

    if (!response.data) {
      throw new Error("No data received from server");
    }

    const writer = fs.createWriteStream(tempFilePath);

    await new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on("finish", () => {
        // Verify the downloaded file
        const stats = fs.statSync(tempFilePath);
        if (stats.size === 0) {
          reject(new Error("Downloaded file is empty"));
        } else {
          resolve();
        }
      });
      writer.on("error", reject);
    });

    // Store in Redis with TTL (10 minutes)
    await redisClient.set(fileUrl, tempFilePath, "EX", 600);

    return tempFilePath;
  } catch (error) {
    // Clean up the temp file if it exists
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    throw new Error(`Failed to download file: ${error.message}`);
  }
};
