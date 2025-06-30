import express from "express";
const router = express.Router();
import OrganisationController from "../controllers/OrganisationController.js";

router.post("/create", OrganisationController.createOrg);
router.get("/check-handle", OrganisationController.checkHandle);
router.get("/check-email", OrganisationController.checkEmail);
router.get("/fetch", OrganisationController.fetchOrgs);

export default router;
