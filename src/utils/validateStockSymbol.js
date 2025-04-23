import axios from "axios";

export const validateStockSymbol = async (symbol) => {
	try {
		const response = await axios.get(
			`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${
				import.meta.env.VITE_TWELVE_DATA_API_KEY
			}`
		);

		const data = response.data;

		console.log(data);
		// Optional: return full quote data if needed later
		return data;
	} catch (error) {
		console.error(`Error validating stock symbol: ${symbol}`, error.message);
		throw new Error(`Failed to validate stock symbol: ${symbol}.`, 400);
	}
};
