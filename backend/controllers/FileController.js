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
      const fileName = `${decoded.email}_${file.originalname}`;
      const filePath = `https://tciincekcqrncwqewmql.supabase.co/storage/v1/object/public/datasets//${fileName}`;

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

      // Get public URL
      const { fileData } = supabase.storage
      .from("datasets")
      .getPublicUrl(filePath);

      // Analyze with Danfo.js
      const df = await danfo.readCSV(file.path);
      const summary = danfo.toJSON(df.describe(), { format: "row" });
      const columns = df.columns;

      // Prepare metadata
      const datasetEntry = {
        fileName: `${decoded.email}_${file.originalname}`,
        fileUrl: filePath,
        email: decoded.email,
        updatedAt: new Date().toISOString(),
      };

      // Commit changes to database
      await supabase
      .from("files")
      .insert([datasetEntry]);

      // Clean up local file
      await fs.unlink(file.path);

      return res.json({
        fileUrl: filePath,
        columns,
        summary,
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
