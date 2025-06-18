import express from "express";
const router = express.Router();
import FileController, { upload } from "../controllers/FileController.js";

router.get("/test", (req, res) => {
  res.json({ message: "File route is working..." });
});
router.post("/upload", upload.single("file"), FileController.uploadFile);
router.get("/get-files", FileController.getFiles);
router.delete("/delete/:fileName", FileController.deleteFile);

export default router;
