import watchlist from "../models/watchlist.js";
import { checkOwnership } from "../utils/checkOwnership.js";
import { createError } from "../utils/createError.js";
import axios from "axios";
import { validateStockSymbol } from "../utils/validateStockSymbol.js";


// GET api/stock
export const getStocksinWatchlist = async (req, res) => {
	try{
		const watchlistId = req.params.watchlistId;
		const Watchlist = await watchlist.findById(watchlistId);

		res.status(200).json({
			message: "Watchlist found successfully.",
			Watchlist});

	}catch(error){
		console.error("Error getting watchlist:", error);
		throw createError("Internal Server Error", 500);
	}
};



// POST api/watchlist/:watchlistId/stock
// for adding a single stock to a specific watchlist
export const addStockToWatchlist = async (req, res, next) => {
	try {
		const watchlistId = req.params.watchlistId;
		const { symbol, note, targetPrice } = req.body;

		if (!symbol) {
			return next(createError("Symbol is required.", 400));
		}

		const existing = await watchlist.findById(watchlistId);
		if (!existing) return next(createError("Watchlist not found.", 404));

		if (!checkOwnership(existing.user, req.user._id)) {
			return next(createError("Unauthorized.", 403));
		}

		const data = await validateStockSymbol(symbol);

		if (!data || data.code || data.message || data.status === "error") {
			return next(createError("Invalid stock symbol.", 400));
		}

		// ✅ Check if stock already exists in watchlist
		const existingStock = existing.stocks.find(
			(stock) => stock.symbol.toUpperCase() === symbol.toUpperCase()
		);

		if (existingStock) {
			return next(
				createError("Stock already exists in the watchlist.", 409)
			);
		}

		// ✅ Add stock
		const newStock = {
			symbol: symbol.toUpperCase(),
			note,
			targetPrice,
		};

		existing.stocks.push(newStock);
		await existing.save();

		res.status(200).json({
			message: "Stock added to watchlist successfully.",
			watchlist: existing,
		});
	} catch (error) {
		console.error("Error adding stock to watchlist:", error.message);
		next(createError(error.message || "Failed to add stock to watchlist.", 500));
	}
};


//POST api/watchlist/:watchlistId/stocks
// for adding multiple stocks to a specific watchlist
export const addMultipleStocksToWatchlist = async (req, res) => {
	try {
		const watchlistId = req.params.watchlistId;
		const { stocks } = req.body;

		if (!Array.isArray(stocks) || stocks.length === 0) {
			throw createError("No stocks provided.", 400);
		}

		const existing = await watchlist.findById(watchlistId);	

		if (!existing) {
			throw createError("Watchlist not found.", 404);
		}

		if (!checkOwnership(existing.user, req.user._id)) {
			throw createError("Unauthorized", 403);
		}

		for (const stock of stocks) {
			const data = await validateStockSymbol(stock.symbol);

			if (!data || data.code || data.message || data.status === "error") {
				throw createError(`Invalid stock symbol ${stock.symbol}.`, 400);
			}

			// ✅ Check if stock already exists in watchlist
			const existingStock = existing.stocks.find(
				(s) => s.symbol.toUpperCase() === stock.symbol.toUpperCase()
			);

			if (existingStock) {
				throw createError(`Stock already exists in the watchlist ${stock.symbol}.`, 409);
			}

			// ✅ Add stock
			const newStock = {
				symbol: stock.symbol.toUpperCase(),
				note: stock.note,
				targetPrice: stock.targetPrice,
			};

			existing.stocks.push(newStock);
		}

		await existing.save();

		res.status(200).json({
			message: "Stocks added to watchlist successfully.",
			watchlist: existing,
		});
	} catch (error) {
		console.error("Error adding stocks to watchlist:", error);
		throw createError("Failed to add stocks to watchlist.", 500);
	}
}




//	DELETE api/watchlist/:watchlistId/:stockId
export const deleteStockFromWatchlist = async (req, res) => {

	try{
		const { watchlistId, stockId } = req.params;


		const existing = await watchlist.findById(watchlistId);

		if(!existing){
			throw createError("Watchlist not found.", 404);
		};

		if (!checkOwnership(existing.user, req.user._id)) {
			throw createError("Unauthorized", 403);
		}

		const updatedStocks = existing.stocks.filter(
			(stock) => stock._id.toString() !== stockId
		);

		existing.stocks = updatedStocks;

		await existing.save();

		res.status(200).json({
			message: "Stock removed from watchlist successfully.",
			watchlist: existing,
		});
	}catch(error){
		console.error("Error removing stock from watchlist:", error);
		throw createError("Internal Server Error", 500);
	}

}
// PUT api/stock/:watchlistId/:stockId
export const updateStockinWatchlist = async (req, res) => {
	try {
		const { watchlistId, stockId } = req.params;
		const { note, targetPrice } = req.body;

		const existing = await watchlist.findById(watchlistId);
		if (!existing) {
			throw createError("Watchlist not found.", 404);
		}

		if (!checkOwnership(existing.user, req.user._id)) {
			throw createError("Unauthorized", 403);
		}

		const stockToUpdate = existing.stocks.id(stockId);
		if (!stockToUpdate) {
			throw createError("Stock not found in watchlist.", 404);
		}

		if (note !== undefined) {
			stockToUpdate.note = note;
		}

		if (targetPrice !== undefined) {
			stockToUpdate.targetPrice = targetPrice;
		}

		await existing.save();

		res.status(200).json({
			message: "Stock updated in watchlist successfully.",
			stock: stockToUpdate,
		});
	} catch (error) {
		console.error("Error updating stock in watchlist:", error);
		throw createError("Internal Server Error", 500);
	}
};
