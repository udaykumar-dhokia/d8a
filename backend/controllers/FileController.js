import supabase from "../db/connectDB.js";
import multer from "multer";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as danfo from "danfojs-node"

dotenv.config();

const upload = multer({ dest: "uploads/" });

const FileController = {
  uploadFile: async (req, res) => {
    try {
      const {token} = req.body;
      const file = req.file;
      if (!file || !token) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded){
        return res.status(403).json({ message: "Invalid token." });
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

      if (fileData){
        return res.status(500).json({ message: `File with ${file.originalname} name already exists.` });
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
        size: fileSize
      };

      // Commit changes to database
      await supabase
      .from("files")
      .insert([datasetEntry]);

      // Get the current user record
      const { data: userData, error: userError } = await supabase
      .from("users")
      .select("totalFiles, totalFileSize")
      .eq("email", decoded.email)
      .single();

      if (userError || !userData) {
        console.error("User fetch error:", userError);
        return res.status(500).json({ message: "Failed to retrieve user data." });
      }

      // Increment totalFiles
      const newTotalFiles = (userData.totalFiles || 0) + 1;
      const newtotalFileSize = (userData.totalFileSize || 0) + fileSize;

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
      });
    } catch (err) {
      console.error("Upload error:", err);
      if (
        err.name == "JsonWebTokenError" ||
        err.name == "TokenExpiredError"
        ){
        return res.status(401).json({ message: "Invalid or expired token" });
    }
    return res.status(500).json({ message: "Internal server error." });      
  }
},

getFiles: async (req, res)=>{
  try{
    const token = req.headers.authorization?.split(" ")[1];


    if (!token){
      return res.status(401).json({ message: "Missing required fields." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded){
      return res.status(403).json({ message: "Invalid token." });
    }

    const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("email", decoded.email)

    if (error){
      return res.status(500).json({ error: "Failed to fetch files." });
    }

    return res.status(200).json({ message: data });
  } catch (err) {
    console.error("Fetch error:", err);
    if (
      err.name == "JsonWebTokenError" ||
      err.name == "TokenExpiredError"
      ){
      return res.status(401).json({ message: "Invalid or expired token" });
  }
  return res.status(500).json({ message: "Internal server error." });      
}
}
};

export { upload };
export default FileController;
