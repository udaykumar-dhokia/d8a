import fs from "fs";
import path from "path";

const tempDir = path.resolve("temp");

fs.readdir(tempDir, (err, files) => {
  if (err) return console.error("Cleanup Error:", err);

  files.forEach((file) => {
    const filePath = path.join(tempDir, file);
    const stats = fs.statSync(filePath);
    const age = Date.now() - stats.mtimeMs;

    if (age > 10 * 60 * 1000) { // older than 10 min
      fs.unlinkSync(filePath);
      console.log(`Deleted old temp file: ${file}`);
    }
  });
});
