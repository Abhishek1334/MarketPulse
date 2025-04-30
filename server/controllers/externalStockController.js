import axios from "axios";
import { createError } from "../utils/createError.js";
import { validateStockSymbol } from "../utils/validateStockSymbol.js";
import yahooFinance from "yahoo-finance2";


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
		res.status(error.status || 500).json({
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
		const results = await yahooFinance.quote(symbols);

		const formatted = results.map((stock) => ({
			symbol: stock.symbol,
			name: stock.shortName,
			price: stock.regularMarketPrice,
			change: stock.regularMarketChange,
			changePercent: stock.regularMarketChangePercent,
			marketCap: stock.marketCap,
			dayHigh: stock.regularMarketDayHigh,
			dayLow: stock.regularMarketDayLow,
			volume: stock.regularMarketVolume,
			fiftyTwoWeekHigh: stock.fiftyTwoWeekHigh,
			fiftyTwoWeekLow: stock.fiftyTwoWeekLow,
		}));

		res.json(formatted);
	} catch (error) {
		console.error(error.response?.data || error.message);
		next(createError("Failed to fetch stock data", 500));
	}
};
export const getStockChartData = async (req, res, next) => {
	try {
		const { symbol, interval = "1d", startDate, endDate } = req.query;

		// Validate required parameters
		if (!symbol || !startDate || !endDate) {
			throw createError(
				400,
				"Symbol, startDate, and endDate are required"
			);
		}

		// Validate stock symbol format
		if (!/^[A-Za-z]{1,5}$/.test(symbol)) {
			throw createError(400, "Invalid stock symbol format");
		}

		// Convert and validate dates
		const currentDate = new Date();
		const start = new Date(startDate);
		const end = new Date(endDate);

		if (isNaN(start)) throw createError(400, "Invalid startDate format");
		if (isNaN(end)) throw createError(400, "Invalid endDate format");
		if (start > currentDate || end > currentDate) {
			throw createError(400, "Cannot request future dates");
		}
		if (start >= end) {
			throw createError(400, "End date must be after start date");
		}

		// Convert to UNIX timestamps
		const period1 = Math.floor(start.getTime() / 1000);
		const period2 = Math.floor(end.getTime() / 1000);
		
		// Fetch data from Yahoo Finance
		const chartData = await yahooFinance.chart(symbol, {
			period1,
			period2,
			interval,
			includePrePost: false,
		});
	// Validate response structure
		if (!chartData?.quotes || !Array.isArray(chartData.quotes)) {
			throw createError(502, "Invalid data format from financial API");
		}

		// Process and validate quotes
		const values = chartData.quotes
			.map((quote) => {
				try {
					return {
						datetime:
							quote.date?.toISOString().split("T")[0] || null,
						open: parseFloat(quote.open?.toFixed(2)) || null,
						high: parseFloat(quote.high?.toFixed(2)) || null,
						low: parseFloat(quote.low?.toFixed(2)) || null,
						close: parseFloat(quote.close?.toFixed(2)) || null,
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
			);

		if (values.length === 0) {
			throw createError(
				404,
				"No valid price data found for the selected range"
			);
		}

		// Build metadata
		const meta = {
			symbol: chartData.meta?.symbol || symbol.toUpperCase(),
			exchange: chartData.meta?.fullExchangeName || "Unknown Exchange",
			currency: chartData.meta?.currency || "USD",
			timezone: chartData.meta?.exchangeTimezoneName || "UTC",
			dataGranularity: chartData.meta?.dataGranularity || interval,
		};

		res.status(200).json({
			success: true,
			meta,
			values,
			warning:
				chartData.quotes.length !== values.length
					? "Some data points were filtered due to invalid format"
					: undefined,
		});
	} catch (error) {
		console.error(`Chart data error for ${symbol}:`, error);
		next(
			createError(
				error.status || 500,
				error.message || "Failed to fetch chart data"
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

		const result = await yahooFinance.search(query);

		const stocksOnly = result.quotes.filter(
			(item) => item.quoteType === "EQUITY"
		);

		res.status(200).json(stocksOnly);
	} catch (error) {
		console.error(error);
		next(createError("Internal Server Error", 500));
	}
};
