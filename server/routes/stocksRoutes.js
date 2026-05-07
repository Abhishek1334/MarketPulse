import express from "express";
import {
	getStockData,
	getStockDataforWatchlist,
	getStockChartData,
	searchStock,
	validateStock
} from "../controllers/externalStockController.js";
import { withCache, cacheStats } from "../utils/cache.js";

const router = express.Router();

const MIN = 60_000;

router.get("/getStock", withCache("quote", 60 * 1_000)(getStockData));
router.get("/getStockforWatchlist", withCache("quote-batch", 60 * 1_000)(getStockDataforWatchlist));
router.get("/chart", withCache("chart", 5 * MIN)(getStockChartData));
router.get("/search", withCache("search", 60 * MIN)(searchStock));
router.get("/validate", withCache("validate", 60 * MIN)(validateStock));

router.get("/_cache-stats", (req, res) => res.json(cacheStats()));

export default router;