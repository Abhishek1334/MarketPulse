import watchlist from "../models/watchlist.js";
import { checkOwnership } from "../utils/checkOwnership.js";
import { createError } from "../utils/createError.js";
import { validateStockSymbol } from "../utils/validateStockSymbol.js";

// POST api/watchlist
export const createWatchlist = async (req, res) => {
	try {
		const { name, stocks } = req.body;

		if (!name || typeof name !== "string") {
			throw createError("Name is required and must be a string.", 400);
		}

		const existingName = await watchlist.findOne({
			user: req.user._id,
			name,
		});

		if (existingName) {
			throw createError(
				"Watchlist with the same name already exists.",
				409
			);
		}

		let stocksArray = [];

		if (Array.isArray(stocks) && stocks.length > 0) {
			const uniqueSymbols = new Set();

			for (const stock of stocks) {
				if (!stock.symbol) {
					throw createError("Each stock must have a symbol.", 400);
				}

				const symbol = stock.symbol.toUpperCase();

				if (uniqueSymbols.has(symbol)) {
					throw createError(`Duplicate stock symbol: ${symbol}`, 400);
				}

				// Validate stock symbol via search API
				const data = await validateStockSymbol(symbol);

				if (
					!data ||
					data.code ||
					data.message ||
					data.status === "error"
				) {
					throw createError(`Invalid stock symbol: ${symbol}`, 400);
				}

				uniqueSymbols.add(symbol);

				stocksArray.push({
					symbol,
					note: stock.note || "",
					targetPrice: stock.targetPrice || null,
				});
			}
		}

		const newWatchlist = new watchlist({
			user: req.user._id,
			name,
			stocks: stocksArray,
		});

		await newWatchlist.save();

		res.status(201).json({
			message: "Watchlist created successfully.",
			watchlist: newWatchlist,
		});
	} catch (error) {
		console.error("Error creating watchlist:", error);
		throw createError(error.message || "Failed to create watchlist.", 500);
	}
};


// GET api/watchlist
export const getWatchlistsByUser = async (req, res) => {
	try {
		const Watchlists = await watchlist.find({ user: req.user._id });
		res.status(200).json(Watchlists);
	} catch (error) {
		console.error("Error getting watchlists:", error);
		throw createError("Internal Server Error", 500);
	}
}


// GET api/watchlist/:watchlistId
// for getting a specific watchlist by id in database 
export const getWatchlist = async (req, res) => {
	try {
		const watchlistId = req.params.watchlistId;
		const Watchlist = await watchlist.findById(watchlistId);

		if (!Watchlist) {
			throw createError("Watchlist not found.", 404);
		}

		res.status(200).json({
			message: "Watchlist found successfully.",
			Watchlist});

	} catch (error) {
		console.error("Error getting watchlist:", error);
		throw createError("Internal Server Error", 500);
	}
};


// PUT api/watchlist/:watchlistId
// for updating a specific watchlist name 
export const updateWatchlist = async (req, res) => {
	try {
		const watchlistId = req.params.watchlistId;
		const { name } = req.body;

		if (!name) {
			throw createError("Name is required.", 400);
		}

		const existing = await watchlist.findById(watchlistId);

		if (!existing) {
			throw createError("Watchlist not found.", 404);
		}

		if (!checkOwnership(existing.user, req.user._id)) {
			throw createError("Unauthorized", 403);
		}

		if (name && name !== existing.name) {
			const duplicate = await watchlist.findOne({ user: req.user._id, name });
			if (duplicate) {
				throw createError("Watchlist with the same name already exists.", 409);
			}
			existing.name = name;
		}

		await existing.save();

		res.status(200).json({
			message: "Watchlist updated successfully.",
			watchlist: existing,
		});
	} catch (error) {
		console.error("Error updating watchlist:", error);
		throw createError("Internal Server Error", 500);
	}
};

// DELETE api/watchlist/:watchlistId
// for deleting a specific watchlist
export const deleteWatchlist = async (req, res) => {
	try {
		const watchlistId = req.params.watchlistId;

		const foundWatchlist = await watchlist.findById(watchlistId);

		if (!foundWatchlist) {
			throw createError("Watchlist not found.", 404);
		}

		if (!checkOwnership(foundWatchlist.user, req.user._id)) {
			throw createError("Unauthorized", 403);
		}
		await foundWatchlist.deleteOne();

		res.status(200).json({ message: "Watchlist deleted successfully." });
	} catch (error) {
		console.error("Error deleting watchlist:", error);
		throw createError("Internal Server Error", 500);
	}
};


