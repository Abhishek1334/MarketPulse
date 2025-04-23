import express from "express";
import {
	searchStock,
	getTimeSeriesStockData,
} from "../controllers/externalStockController.js";
const router = express.Router();

router.get("/search", searchStock);

router.get("/timeseries", getTimeSeriesStockData);

export default router;