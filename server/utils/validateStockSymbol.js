import yahooFinance from "yahoo-finance2";

export const validateStockSymbol = async (symbol) => {
	try {
		// Search for the symbol using Yahoo Finance's search API
		const result = await yahooFinance.search(symbol);

		// Check if any stocks were returned
		if (!result.quotes || result.quotes.length === 0) {
			throw new Error(`Stock symbol ${symbol} not found.`);
		}

		// Optionally, return the first matched result
		return result.quotes[0]; // This will return the first stock that matches the search
	} catch (error) {
		console.error("Error validating stock symbol:", error.message || error);
		throw new Error(`Error validating stock symbol: ${symbol}`);
	}
};
