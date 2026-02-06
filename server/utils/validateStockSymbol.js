import axios from "axios";

export const validateStockSymbol = async (symbol) => {
	try {
		const cleanedSymbol = symbol.trim().toUpperCase();
		
		// Use Twelve Data symbol_search to validate the symbol
		const response = await axios.get(
			`https://api.twelvedata.com/symbol_search`,
			{
				params: {
					symbol: cleanedSymbol,
					apikey: process.env.TWELVE_DATA_API_KEY
				}
			}
		);

		// Check if result is valid
		if (response.data.status === "error") {
			throw new Error(`Stock symbol ${symbol} not found.`);
		}

		const data = response.data.data || [];
		
		// Check if any stocks were returned
		if (data.length === 0) {
			throw new Error(`Stock symbol ${symbol} not found.`);
		}

		// Find exact match first, otherwise return first result
		const exactMatch = data.find(item => item.symbol.toUpperCase() === cleanedSymbol);
		const result = exactMatch || data[0];
		
		// Return formatted result similar to Yahoo Finance format for compatibility
		return {
			symbol: result.symbol,
			shortname: result.instrument_name || result.name || result.symbol,
			longname: result.instrument_name || result.name || result.symbol,
			quoteType: "EQUITY",
			exchange: result.exchange || "Unknown"
		};
	} catch (error) {
		// Handle Twelve Data API errors
		if (error.response?.data?.status === "error") {
			if (error.response.data.code === 429) {
				const rateLimitError = new Error("Rate limit exceeded. Please try again later.");
				rateLimitError.statusCode = 429;
				throw rateLimitError;
			}
		}
		
		// Re-throw if it's already a known error
		if (error.message && error.message.includes("not found")) {
			throw error;
		}
		
		// Handle rate limit errors
		if (error.message && (error.message.includes("Too Many Requests") || error.message.includes("rate limit"))) {
			const rateLimitError = new Error("Rate limit exceeded. Please try again later.");
			rateLimitError.statusCode = 429;
			throw rateLimitError;
		}
		
		console.error("Error validating stock symbol:", error.message || error);
		throw new Error(`Error validating stock symbol: ${symbol}`);
	}
};
