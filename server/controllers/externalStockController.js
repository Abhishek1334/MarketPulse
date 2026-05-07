import axios from "axios";
import { createError } from "../utils/createError.js";
import { validateStockSymbol } from "../utils/validateStockSymbol.js";


export const getStockData = async (req, res, next) => {
	const symbol = req.query.symbol;

	if (!symbol) {
		throw createError("Symbol is required.", 400);
	}

	try {
		// Validate the stock symbol first
		const data = await validateStockSymbol(symbol);
		
		// Fetch stock data after validation
		const response = await axios.get(
			`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${process.env.TWELVE_DATA_API_KEY}`
		);

		res.json(response.data);
	} catch (error) {
		console.error(error.response?.data || error.message);
		next(createError("Failed to fetch stock data", 500));
	}
};


export const validateStock = async (req, res) => {
	try {
		const { symbol } = req.query;

		if (!symbol) {
			throw createError("Stock symbol is required.", 400);
		}


		// Validate the stock symbol using the updated function
		const data = await validateStockSymbol(symbol);


		// Check if the validation result is invalid
		if (!data || data.code || data.message || data.status === "error") {
			throw createError(`Invalid stock symbol: ${symbol}.`, 400);
		}

		// Return a success message
		res.status(200).json({
			message: `Stock symbol ${symbol} is valid.`,
			data,
		});
	} catch (error) {
		console.error("Error validating stock symbol:", error);
		res.status(error.statusCode || 500).json({
			message: error.message || "Failed to validate stock symbol.",
		});
	}
};

export const getStockDataforWatchlist = async (req, res, next) => {
	let symbols = req.query.symbols;

	if (!symbols) {
		throw createError("Symbols are required.", 400);
	}

	// If symbols is a string, split it into an array
	if (typeof symbols === "string") {
		symbols = symbols.split(",").map((s) => s.trim());
	}

	try {
		// Twelve Data supports multiple symbols in one request
		const symbolsString = symbols.join(",");
		
		const response = await axios.get(
			`https://api.twelvedata.com/quote`,
			{
				params: {
					symbol: symbolsString,
					apikey: process.env.TWELVE_DATA_API_KEY
				}
			}
		);

		// Handle both single and multiple symbol responses
		let quotes = [];
		if (Array.isArray(response.data)) {
			quotes = response.data;
		} else if (response.data.symbol) {
			// Single symbol response
			quotes = [response.data];
		} else if (response.data.data) {
			// Response wrapped in data property
			quotes = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
		}

		const formatted = quotes.map((stock) => {
			// Calculate change and changePercent if not provided
			const price = parseFloat(stock.close || stock.price || 0);
			const previousClose = parseFloat(stock.previous_close || 0);
			const change = previousClose ? price - previousClose : parseFloat(stock.change || 0);
			const changePercent = previousClose ? ((change / previousClose) * 100) : parseFloat(stock.percent_change || 0);

			return {
				symbol: stock.symbol,
				name: stock.name || stock.instrument_name || stock.symbol,
				price: price,
				change: change,
				changePercent: changePercent,
				marketCap: stock.market_cap ? parseFloat(stock.market_cap) : null,
				dayHigh: parseFloat(stock.high || 0),
				dayLow: parseFloat(stock.low || 0),
				volume: parseInt(stock.volume || 0),
				fiftyTwoWeekHigh: parseFloat(stock["52_week_high"] || stock.fifty_two_week_high || 0),
				fiftyTwoWeekLow: parseFloat(stock["52_week_low"] || stock.fifty_two_week_low || 0),
			};
		});

		res.json(formatted);
	} catch (error) {
		console.error("Watchlist stock data error:", error.response?.data || error.message);
		
		// Handle Twelve Data API errors
		if (error.response?.data?.status === "error") {
			const errorMessage = error.response.data.message || "Failed to fetch stock data";
			const statusCode = error.response.data.code === 429 ? 429 : 500;
			return next(createError(errorMessage, statusCode));
		}
		
		next(createError("Failed to fetch stock data", 500));
	}
};


export const getStockChartData = async (req, res, next) => {
	try {
		const { symbol, interval = "1d", startDate, endDate } = req.query;

		if (!symbol || !startDate || !endDate) {
			throw createError("Symbol, startDate, and endDate are required", 400);
		}
		const cleanedSymbol = symbol.trim().toUpperCase();
		if (!/^[A-Z]{1,5}$/.test(cleanedSymbol)) {
			throw createError("Invalid stock symbol format", 400);
		}

		const currentDate = new Date();
		const start = new Date(startDate);
		const end = new Date(endDate);

		if (isNaN(start)) throw createError("Invalid startDate format", 400);
		if (isNaN(end)) throw createError("Invalid endDate format", 400);
		if (start > currentDate || end > currentDate) {
			throw createError("Cannot request future dates", 400);
		}
		if (start >= end) {
			throw createError("End date must be after start date", 400);
		}

		const formatDate = (date) => date.toISOString().split("T")[0];
		const startDateStr = formatDate(start);
		const endDateStr = formatDate(end);

		const intervalMap = {
			"1m": "1min",
			"5m": "5min",
			"15m": "15min",
			"30m": "30min",
			"1h": "1hour",
			"4h": "4hour",
			"1d": "1day",
			"1w": "1week",
			"1mo": "1month"
		};
		const twelveDataInterval = intervalMap[interval] || interval;

		const response = await axios.get(
			`https://api.twelvedata.com/time_series`,
			{
				params: {
					symbol: cleanedSymbol,
					interval: twelveDataInterval,
					start_date: startDateStr,
					end_date: endDateStr,
					apikey: process.env.TWELVE_DATA_API_KEY,
					format: "JSON"
				}
			}
		);

		if (response.data.status === "error") {
			throw createError(response.data.message || "Invalid data format from financial API", 400);
		}

		if (!response.data.values || !Array.isArray(response.data.values)) {
			throw createError("Invalid data format from financial API", 502);
		}

		const rawCount = response.data.values.length;

		const values = response.data.values
			.map((quote) => {
				try {
					return {
						datetime: quote.datetime || null,
						open: parseFloat(quote.open) || null,
						high: parseFloat(quote.high) || null,
						low: parseFloat(quote.low) || null,
						close: parseFloat(quote.close) || null,
						volume: parseInt(quote.volume) || null,
					};
				} catch (error) {
					console.warn("Failed to process quote:", quote);
					return null;
				}
			})
			.filter(
				(item) =>
					item?.datetime &&
					item.open !== null &&
					item.high !== null &&
					item.low !== null &&
					item.close !== null
			)
			.reverse();

		if (values.length === 0) {
			throw createError("No valid price data found for the selected range", 404);
		}

		const meta = {
			symbol: response.data.meta?.symbol || cleanedSymbol.toUpperCase(),
			exchange: response.data.meta?.exchange || "Unknown Exchange",
			currency: response.data.meta?.currency || "USD",
			timezone: response.data.meta?.exchange_timezone || "UTC",
			dataGranularity: response.data.meta?.interval || interval,
		};
		res.status(200).json({
			success: true,
			meta,
			values,
			warning:
				rawCount !== values.length
					? "Some data points were filtered due to invalid format"
					: undefined,
		});
	} catch (error) {
		console.error(
			`Chart data error for ${req?.query?.symbol || "unknown symbol"}:`,
			error
		);
		next(
			createError(
				error.message || "Failed to fetch chart data",
				error.statusCode || 500
			)
		);
	}
};


export const searchStock = async (req, res, next) => {
	try {
		const { query } = req.query;

		if (!query) {
			throw createError("Search Query is required.", 400);
		}

		// Use Twelve Data symbol_search endpoint
		const response = await axios.get(
			`https://api.twelvedata.com/symbol_search`,
			{
				params: {
					symbol: query,
					apikey: process.env.TWELVE_DATA_API_KEY
				}
			}
		);

		// Check if result is valid
		if (!response.data || response.data.status === "error") {
			throw createError(response.data?.message || "No search results found", 404);
		}

		// Filter for stocks only (type: "Common Stock" or "Equity")
		const data = response.data.data || [];
		const stocksOnly = data
			.filter((item) => {
				const instrumentType = item.instrument_type?.toLowerCase() || "";
				return instrumentType === "common stock" || 
				       instrumentType === "equity" || 
				       instrumentType === "stock" ||
				       !instrumentType; // Include if type is not specified
			})
			.map((item) => ({
				symbol: item.symbol,
				shortname: item.instrument_name || item.name || item.symbol,
				longname: item.instrument_name || item.name || item.symbol,
				quoteType: "EQUITY",
				type: item.instrument_type || "Stock",
				exchange: item.exchange || "Unknown"
			}));

		if (stocksOnly.length === 0) {
			throw createError("No stock results found", 404);
		}

		res.status(200).json(stocksOnly);
	} catch (error) {
		console.error("Search stock error:", error);
		
		// Handle Twelve Data API errors
		if (error.response?.data?.status === "error") {
			const errorMessage = error.response.data.message || "API error";
			const statusCode = error.response.data.code === 429 ? 429 : 400;
			return next(createError(errorMessage, statusCode));
		}
		
		// Handle network/API errors
		if (error.response) {
			const statusCode = error.response.status || 500;
			const errorMessage = error.response.data?.message || error.response.statusText || "External API error";
			return next(createError(errorMessage, statusCode));
		}
		
		// Handle custom errors
		if (error.statusCode) {
			return next(createError(error.message || "Failed to search stocks", error.statusCode));
		}
		
		// Generic error fallback
		next(createError(error.message || "Internal Server Error", 500));
	}
};
