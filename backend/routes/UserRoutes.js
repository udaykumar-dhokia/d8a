import express from "express";
const router = express.Router();
import UserController from "../controllers/UserController.js";

router.get("/get-data", UserController.getData);

export default router;