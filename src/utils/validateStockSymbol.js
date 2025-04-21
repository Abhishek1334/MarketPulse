import axios from "axios";
import { createError } from "./createError.js";

export const validateStockSymbol = async (symbol) => {
	try {
		const response = await axios.get(
			`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${process.env.TWELVE_DATA_API_KEY}`
		);

		const data = response.data;

		if (!data || data.code || data.message || data.status === "error") {
			throw createError("Invalid stock symbol.", 400);
		}

		// Optional: return full quote data if needed later
		return data;
	} catch (error) {
		console.error(`Error validating stock symbol: ${symbol}`, error.message);
		throw createError("Failed to validate stock symbol.", 400);
	}
};
