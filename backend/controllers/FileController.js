import supabase from "../db/connectDB.js";
import multer from "multer";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as danfo from "danfojs-node";

dotenv.config();

// Configure multer to only accept CSV files
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

const FileController = {
  uploadFile: async (req, res) => {
    try {
      const { token } = req.body;
      const file = req.file;

      if (!file || !token) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      // Additional validation for CSV files
      if (!file.originalname.endsWith(".csv")) {
        return res.status(400).json({ error: "Only CSV files are allowed." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return res.status(403).json({ message: "Invalid token." });
      }

      // Check user's file limits before uploading
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("totalFiles, maxFiles")
        .eq("email", decoded.email)
        .single();

      if (userError || !userData) {
        console.error("User fetch error:", userError);
        return res
          .status(500)
          .json({ message: "Failed to retrieve user data." });
      }

      // Check if user has reached their file limit
      const currentFiles = userData.totalFiles || 0;
      const maxFiles = userData.maxFiles || 10;

      if (currentFiles >= maxFiles) {
        return res.status(403).json({
          message: `File upload limit reached. You can upload up to ${maxFiles} files.`,
          limitReached: true,
          currentFiles,
          maxFiles,
        });
      }

      const fileBuffer = await fs.readFile(file.path);
      const fileSize = file.size;
      const fileName = `${decoded.email}_${file.originalname}`;
      const filePath = `https://tciincekcqrncwqewmql.supabase.co/storage/v1/object/public/datasets//${fileName}`;

      const { data: fileData } = await supabase
        .from("files")
        .select("id")
        .eq("fileName", fileName)
        .single();

      if (fileData) {
        return res.status(500).json({
          message: `File with ${file.originalname} name already exists.`,
        });
      }

      // Upload the file to database
      const { data, error } = await supabase.storage
        .from("datasets")
        .upload(fileName, fileBuffer, {
          contentType: "text/csv",
          upsert: true,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        return res.status(500).json({ error: "Failed to upload to Supabase" });
      }

      // Prepare metadata
      const datasetEntry = {
        fileName: `${decoded.email}_${file.originalname}`,
        fileUrl: filePath,
        email: decoded.email,
        updatedAt: new Date().toISOString(),
        size: fileSize,
      };

      // Commit changes to database
      await supabase.from("files").insert([datasetEntry]);

      // Get the current user record again for updating
      const { data: updatedUserData, error: updatedUserError } = await supabase
        .from("users")
        .select("totalFiles, totalFileSize")
        .eq("email", decoded.email)
        .single();

      if (updatedUserError || !updatedUserData) {
        console.error("User fetch error:", updatedUserError);
        return res
          .status(500)
          .json({ message: "Failed to retrieve user data." });
      }

      // Increment totalFiles
      const newTotalFiles = (updatedUserData.totalFiles || 0) + 1;
      const newtotalFileSize = (updatedUserData.totalFileSize || 0) + fileSize;

      const { error: updateError } = await supabase
        .from("users")
        .update({ totalFiles: newTotalFiles, totalFileSize: newtotalFileSize })
        .eq("email", decoded.email);

      if (updateError) {
        console.error("User update error:", updateError);
        return res.status(500).json({ message: "Failed to update user data." });
      }

      // Clean up local file
      await fs.unlink(file.path);

      return res.json({
        fileUrl: filePath,
        currentFiles: newTotalFiles,
        maxFiles,
      });
    } catch (err) {
      console.error("Upload error:", err);
      if (err.message === "Only CSV files are allowed") {
        return res.status(400).json({ message: err.message });
      }
      if (err.name == "JsonWebTokenError" || err.name == "TokenExpiredError") {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      return res.status(500).json({ message: "Internal server error." });
    }
  },

  getFiles: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Missing required fields." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return res.status(403).json({ message: "Invalid token." });
      }

      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("email", decoded.email);

      if (error) {
        return res.status(500).json({ error: "Failed to fetch files." });
      }

      return res.status(200).json({ message: data });
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.name == "JsonWebTokenError" || err.name == "TokenExpiredError") {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      return res.status(500).json({ message: "Internal server error." });
    }
  },

  deleteFile: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const { fileName } = req.params;

      if (!token) {
        return res.status(401).json({ message: "Missing required fields." });
      }

      if (!fileName) {
        return res.status(400).json({ message: "File name is required." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return res.status(403).json({ message: "Invalid token." });
      }

      // First, get the file details to ensure it belongs to the user
      const { data: fileData, error: fileError } = await supabase
        .from("files")
        .select("*")
        .eq("fileName", fileName)
        .eq("email", decoded.email)
        .single();

      if (fileError || !fileData) {
        return res
          .status(404)
          .json({ message: "File not found or access denied." });
      }

      // Delete file from Supabase storage
      const { error: storageError } = await supabase.storage
        .from("datasets")
        .remove([fileName]);

      if (storageError) {
        console.error("Storage delete error:", storageError);
        // Continue with database deletion even if storage deletion fails
      }

      // Delete file record from database
      const { error: deleteError } = await supabase
        .from("files")
        .delete()
        .eq("fileName", fileName)
        .eq("email", decoded.email);

      if (deleteError) {
        console.error("Database delete error:", deleteError);
        return res
          .status(500)
          .json({ message: "Failed to delete file record." });
      }

      // Update user's file count
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("totalFiles, totalFileSize")
        .eq("email", decoded.email)
        .single();

      if (!userError && userData) {
        const newTotalFiles = Math.max((userData.totalFiles || 0) - 1, 0);
        const newTotalFileSize = Math.max(
          (userData.totalFileSize || 0) - (fileData.size || 0),
          0
        );

        await supabase
          .from("users")
          .update({
            totalFiles: newTotalFiles,
            totalFileSize: newTotalFileSize,
          })
          .eq("email", decoded.email);
      }

      return res.status(200).json({
        message: "File deleted successfully.",
        deletedFile: fileName,
      });
    } catch (err) {
      console.error("Delete error:", err);
      if (err.name == "JsonWebTokenError" || err.name == "TokenExpiredError") {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      return res.status(500).json({ message: "Internal server error." });
    }
  },
};

export { upload };
export default FileController;
