import axios from "axios";
import { createError } from "./createError.js";

export const validateStockSymbol = async (symbol) => {
	try {
		const response = await axios.get(
			`https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`
		);

		const quoteData = response.data?.quoteResponse?.result?.[0];

		// If no valid data is returned for symbol
		if (!quoteData || !quoteData.symbol) {
			throw createError("Invalid stock symbol.", 400);
		}

		// Optional: return full quote data if needed later
		return quoteData;
	} catch (error) {
		console.error(
			`Error validating stock symbol: ${symbol}`,
			error.message
		);
		throw createError(`Failed to validate stock symbol: ${symbol}.`, 400);
	}
};
