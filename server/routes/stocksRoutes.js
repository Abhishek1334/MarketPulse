import express from "express";
import {
	getStockData,
	getStockDataforWatchlist,
	getStockChartData,
	searchStock,
	validateStock
} from "../controllers/externalStockController.js";
const router = express.Router();

router.get("/getStock", getStockData);

router.get("/getStockforWatchlist", getStockDataforWatchlist);

router.get("/chart", getStockChartData);

router.get("/search", searchStock);

router.get("/validate", validateStock);

export default router;