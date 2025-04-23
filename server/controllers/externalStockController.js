import axios from "axios";

export const searchStock = async (req, res) => {
	const symbol = req.query.symbol;

	if(!symbol){
		return res.status(400).json({ error: "Symbol is required." });
	}

	try {
		const response = await axios.get(
			`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${process.env.TWELVE_DATA_API_KEY}`
		);

		res.json(response.data);
	} catch (error) {
		console.error(error.response?.data || error.message);
		res.status(500).json({ error: "Failed to fetch stock data" });
	}
};
//https://api.twelvedata.com/time_series?apikey=6b70e35d66f7400782ea3ce0838afbe3&interval=5min&format=JSON&symbol=AAPL
export const getTimeSeriesStockData = async (req, res) => {
	const symbol = req.query.symbol;

	if (!symbol) {
		return res.status(400).json({ error: "Stock symbol is required" });
	}

	try {
		const response = await axios.get(
			"https://api.twelvedata.com/time_series",
			{
				params: {
					apikey: process.env.TWELVE_DATA_API_KEY,
					interval: "5min",
					format: "JSON",
					symbol,
				},
			}
		);

		// Check if data exists in the response
		if (response.data) {
			res.json(response.data);
		} else {
			res.status(404).json({
				error: "No time series data found for this symbol",
			});
		}
	} catch (error) {
		console.error(error.response?.data || error.message);
		res.status(500).json({ error: "Failed to fetch stock data" });
	}
};