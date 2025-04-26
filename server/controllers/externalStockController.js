import axios from "axios";
import yahooFinance from "yahoo-finance2";
import { createError } from "../utils/createError.js";

export const getStockData = async (req, res, next) => {
	const symbol = req.query.symbol;

	if(!symbol){
		throw createError("Symbol is required.", 400);
	}

	try {
		const response = await axios.get(
			`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${process.env.TWELVE_DATA_API_KEY}`
		);

		res.json(response.data);
	} catch (error) {
		console.error(error.response?.data || error.message);
		next(createError("Failed to fetch stock data", 500));
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


export const getStockChartData = async (req, res) => {
	try {
		const { symbol, interval = "1d", range, startDate, endDate } = req.query;

		if (!symbol || !startDate || !endDate) {
			throw createError(
				"Symbol, start date, and end date are required.",
				400
			)
		}

		// Fetch historical stock data
		const results = await yahooFinance.historical(symbol, {
			period1: startDate, // e.g., '2024-04-01'
			period2: endDate, // e.g., '2024-04-25'
			interval, // e.g., '1d', '1wk'
			range,
		});

		// Format for frontend
		const values = results.map((item) => ({
			datetime: item.date.toISOString().split("T")[0],
			open: item.open.toFixed(2),
			high: item.high.toFixed(2),
			low: item.low.toFixed(2),
			close: item.close.toFixed(2),
			volume: item.volume.toString(),
		}));

		const meta = {
			symbol,
			interval,
			currency: "USD", // Static (Yahoo always gives in USD)
			exchange_timezone: "America/New_York",
			exchange: "NASDAQ",
			mic_code: "XNGS",
			type: "Common Stock",
		};

		res.status(200).json({ meta, values });
	} catch (error) {
		console.error("Error fetching stock chart data :", error);
		throw createError("Internal Server Error", 500);
	}
};

export const searchStock = async (req,res,next) => {
	try {
		const {query} = req.query;

		if(!query){
			throw createError("Search Query is required.", 400);
		}

		const result = await yahooFinance.search(query);

		const stocksOnly = result.quotes.filter(item => item.quoteType === "EQUITY");

		res.status(200).json(stocksOnly);

	}catch(error){
		console.error(error);
		next(createError("Internal Server Error", 500));
	}
}