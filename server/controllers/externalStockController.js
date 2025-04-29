import axios from "axios";
import { createError } from "../utils/createError.js";
import { validateStockSymbol } from "../utils/validateStockSymbol.js";
import yahooFinance from "yahoo-finance2";
// Extract the crumb from the cookies or page content
const getCrumbFromCookies = (cookies) => {
	if (!cookies) return null;

	const crumbCookie = cookies.find((cookie) => cookie.includes("crumb="));
	if (crumbCookie) {
		const match = crumbCookie.match(/crumb=([a-zA-Z0-9.]+)/);
		return match ? match[1] : null;
	}

	return null;
};

export const getCrumb = async () => {
	try {
		// Send a request to Yahoo Finance's stock page with custom headers to simulate a browser request
		const response = await axios.get(
			"https://finance.yahoo.com/quote/AAPL",
			{
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
					"Accept-Language": "en-US,en;q=0.9",
					"Accept-Encoding": "gzip, deflate, br",
					Connection: "keep-alive",
				},
				maxRedirects: 5, // Limit the number of redirects
			}
		);

		console.log("Response Status Code:", response.status); // Log the status code
		console.log("Response Headers:", response.headers); // Log the entire headers
		if (response.headers["content-type"].includes("text/html")) {
			console.log("Received an HTML page instead of expected data.");
		}

		const cookies = response.headers["set-cookie"];
		console.log("Cookies Received:", cookies); // Log the cookies

		const crumb = getCrumbFromCookies(cookies);
		console.log("Extracted Crumb:", crumb); // Log the extracted crumb

		if (!crumb) {
			throw new Error("Unable to find crumb.");
		}

		return crumb;
	} catch (error) {
		console.error("Error fetching crumb:", error);
		throw error; // Rethrow the error to handle it upstream
	}
};


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

		console.log("Validating stock symbol:", symbol);

		// Validate the stock symbol using the updated function
		const data = await validateStockSymbol(symbol);

		console.log("Validation result:", data);

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

export const getStockChartData = async (req, res) => {
	try {
		const {
			symbol,
			interval = "1d",
			range,
			startDate,
			endDate,
		} = req.query;

		if (!symbol || !startDate || !endDate) {
			throw createError(
				"Symbol, start date, and end date are required.",
				400
			);
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
