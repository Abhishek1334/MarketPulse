import Portfolio from "../models/portfolio.js";
import { createError } from "../utils/createError.js";

const ensurePortfolio = async (userId) => {
	let portfolio = await Portfolio.findOne({ user: userId });
	if (!portfolio) {
		portfolio = await Portfolio.create({ user: userId });
	}
	return portfolio;
};

// GET /api/portfolio
export const getPortfolio = async (req, res, next) => {
	try {
		const portfolio = await ensurePortfolio(req.user._id);
		res.status(200).json(portfolio);
	} catch (error) {
		console.error("Error fetching portfolio:", error);
		next(createError("Failed to fetch portfolio.", 500));
	}
};

// POST /api/portfolio/holdings
export const addHolding = async (req, res, next) => {
	try {
		const { symbol, shares, averagePrice, purchaseDate, notes, sector } = req.body;
		if (!symbol || shares == null || averagePrice == null) {
			throw createError("symbol, shares, and averagePrice are required.", 400);
		}
		const portfolio = await ensurePortfolio(req.user._id);
		portfolio.holdings.push({
			symbol: String(symbol).toUpperCase(),
			shares: Number(shares),
			averagePrice: Number(averagePrice),
			purchaseDate: purchaseDate || new Date(),
			notes: notes || "",
			sector: sector || "Unknown",
		});
		await portfolio.save();
		res.status(201).json(portfolio);
	} catch (error) {
		console.error("Error adding holding:", error);
		next(createError(error.message || "Failed to add holding.", error.statusCode || 500));
	}
};

// PUT /api/portfolio/holdings/:holdingId
export const updateHolding = async (req, res, next) => {
	try {
		const { holdingId } = req.params;
		const updates = req.body || {};
		const portfolio = await Portfolio.findOne({ user: req.user._id });
		if (!portfolio) throw createError("Portfolio not found.", 404);
		const holding = portfolio.holdings.id(holdingId);
		if (!holding) throw createError("Holding not found.", 404);
		const allowed = ["shares", "averagePrice", "purchaseDate", "notes", "sector"];
		for (const key of allowed) {
			if (updates[key] !== undefined) holding[key] = updates[key];
		}
		if (updates.symbol) holding.symbol = String(updates.symbol).toUpperCase();
		await portfolio.save();
		res.status(200).json(portfolio);
	} catch (error) {
		console.error("Error updating holding:", error);
		next(createError(error.message || "Failed to update holding.", error.statusCode || 500));
	}
};

// DELETE /api/portfolio/holdings/:holdingId
export const deleteHolding = async (req, res, next) => {
	try {
		const { holdingId } = req.params;
		const portfolio = await Portfolio.findOneAndUpdate(
			{ user: req.user._id },
			{ $pull: { holdings: { _id: holdingId } } },
			{ new: true }
		);
		if (!portfolio) throw createError("Portfolio not found.", 404);
		res.status(200).json(portfolio);
	} catch (error) {
		console.error("Error deleting holding:", error);
		next(createError(error.message || "Failed to delete holding.", error.statusCode || 500));
	}
};

// POST /api/portfolio/transactions
export const addTransaction = async (req, res, next) => {
	try {
		const { symbol, type, shares, price, date, fees, notes } = req.body;
		if (!symbol || !type || shares == null || price == null) {
			throw createError("symbol, type, shares, and price are required.", 400);
		}
		const portfolio = await ensurePortfolio(req.user._id);
		portfolio.transactions.push({
			symbol: String(symbol).toUpperCase(),
			type,
			shares: Number(shares),
			price: Number(price),
			date: date || new Date(),
			fees: Number(fees) || 0,
			notes: notes || "",
		});
		await portfolio.save();
		res.status(201).json(portfolio);
	} catch (error) {
		console.error("Error adding transaction:", error);
		next(createError(error.message || "Failed to add transaction.", error.statusCode || 500));
	}
};

// PUT /api/portfolio/settings
export const updateSettings = async (req, res, next) => {
	try {
		const portfolio = await ensurePortfolio(req.user._id);
		Object.assign(portfolio.settings, req.body || {});
		await portfolio.save();
		res.status(200).json(portfolio);
	} catch (error) {
		console.error("Error updating settings:", error);
		next(createError("Failed to update settings.", 500));
	}
};

// POST /api/portfolio/import — one-time migration from client localStorage
export const importPortfolio = async (req, res, next) => {
	try {
		const { holdings, transactions, settings } = req.body || {};
		const portfolio = await ensurePortfolio(req.user._id);

		if (Array.isArray(holdings)) {
			portfolio.holdings = holdings.map((h) => ({
				symbol: String(h.symbol || "").toUpperCase(),
				shares: Number(h.shares) || 0,
				averagePrice: Number(h.averagePrice) || 0,
				purchaseDate: h.purchaseDate || new Date(),
				notes: h.notes || "",
				sector: h.sector || "Unknown",
			}));
		}
		if (Array.isArray(transactions)) {
			portfolio.transactions = transactions.map((t) => ({
				symbol: String(t.symbol || "").toUpperCase(),
				type: t.type || "buy",
				shares: Number(t.shares) || 0,
				price: Number(t.price) || 0,
				date: t.date || new Date(),
				fees: Number(t.fees) || 0,
				notes: t.notes || "",
			}));
		}
		if (settings && typeof settings === "object") {
			Object.assign(portfolio.settings, settings);
		}
		await portfolio.save();
		res.status(200).json(portfolio);
	} catch (error) {
		console.error("Error importing portfolio:", error);
		next(createError("Failed to import portfolio.", 500));
	}
};
