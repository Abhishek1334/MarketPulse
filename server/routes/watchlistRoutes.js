import express from "express";
import {
	createWatchlist,
	getWatchlistsByUser,
	getWatchlist,
	deleteWatchlist,
	updateWatchlist,
} from "../controllers/watchlistController.js";

import {
	getStocksinWatchlist,
	AddStockToWatchlist,
	addMultipleStocksToWatchlist,
	deleteStockFromWatchlist,
	updateStockinWatchlist,
} from "../controllers/stockController.js";

const router = express.Router();

// ======================
// 🔹 WATCHLIST ROUTES
// ======================

// @route   POST /api/watchlist
// @desc    Create a new watchlist
router.post("/", createWatchlist);

// @route   GET /api/watchlist
// @desc    Get all watchlists for the logged-in user
router.get("/", getWatchlistsByUser);

// @route   GET /api/watchlist/:watchlistId
// @desc    Get a specific watchlist by ID
router.get("/:watchlistId", getWatchlist);

// @route   DELETE /api/watchlist/:watchlistId
// @desc    Delete a watchlist by ID
router.delete("/:watchlistId", deleteWatchlist);

// @route   PUT /api/watchlist/:watchlistId
// @desc    Update a watchlist by ID
router.put("/:watchlistId", updateWatchlist);

// ======================
// 🔹 STOCK ROUTES (Inside a Watchlist)
// ======================

// @route   GET /api/watchlist/:watchlistId/stocks
// @desc    Get all stocks in a specific watchlist
router.get("/:watchlistId/stocks", getStocksinWatchlist);

router.post("/:watchlistId/stock", AddStockToWatchlist)

// @route   POST /api/watchlist/:watchlistId/stocks
// @desc    Add multiple stocks to a specific watchlist
router.post("/:watchlistId/stocks", addMultipleStocksToWatchlist);


// @route   DELETE /api/watchlist/:watchlistId/stocks/:stockId
// @desc    Remove a stock from a specific watchlist
router.delete("/:watchlistId/stock/:stockId", deleteStockFromWatchlist);

// @route   PUT /api/watchlist/:watchlistId/stocks/:stockId
// @desc    Update a stock inside a specific watchlist
router.put("/:watchlistId/stock/:stockId", updateStockinWatchlist);

export default router;
