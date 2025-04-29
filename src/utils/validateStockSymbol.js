import yahooFinance from "yahoo-finance2";
export const validateStockSymbol = async (symbol) => {
	try {
		const result = await yahooFinance.quote(symbol, {
			headers: {
				"x-crumb": "YOUR_CRUMB_HERE",
				// any other necessary cookies or headers
			},
		});
		return result;
	} catch (error) {
		console.error("Error validating stock symbol:", error);
		throw error; // or handle accordingly
	}
};