import express from "express";
import AnalyseController from "../controllers/AnalyseController.js";

const router = express.Router();

router.post("/head", AnalyseController.getHead);
router.post("/tail", AnalyseController.getTail);
router.post("/describe", AnalyseController.getDescribe);
router.post("/info", AnalyseController.getInfo);
router.post("/null-counts", AnalyseController.getNullCounts);
router.post("/columns", AnalyseController.getColumns);
router.post("/view", AnalyseController.getView);
router.post("/histogram", AnalyseController.getHistogram);
router.post("/scatter-plot", AnalyseController.getScatterPlot);

export default router;
