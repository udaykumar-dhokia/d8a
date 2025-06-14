import express from "express";
const router = express.Router();
import AuthController from "../controllers/AuthController.js";

router.post("/login", AuthController.loginUser);
router.post("/register", AuthController.registerUser);
router.post("/verify-token", AuthController.verifyToken);

export default router;
