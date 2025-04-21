import axios from "axios";

export const searchStock = async (req, res) => {
	const symbol = req.query.symbol;

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