import axios from "axios";

export const validateStockSymbol = async (symbol) => {
	try {
		const response = await axios.get(
			`https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`
		);

		const quoteData = response.data?.quoteResponse?.result?.[0];

		console.log(quoteData);

		// If no valid data is returned
		if (!quoteData || !quoteData.symbol) {
			throw new Error(`Invalid stock symbol: ${symbol}`);
		}

		// Optional: return full quote data
		return quoteData;
	} catch (error) {
		console.error(
			`Error validating stock symbol: ${symbol}`,
			error.message
		);
		throw new Error(`Failed to validate stock symbol: ${symbol}`);
	}
};
