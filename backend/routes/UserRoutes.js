import express from "express";
const router = express.Router();
import UserController from "../controllers/UserController.js";

router.get("/get-data", UserController.getData);
router.get("/theme", UserController.getTheme);
router.post("/theme", UserController.updateTheme);

export default router;
