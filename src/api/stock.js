import axios from "./axiosInstance.js";

//get stock data from external API by sending symbol as query

export const getStockDatafromExternalAPI = async (symbol) => {
	try {
		const response = await axios.get(
			`/stock/search?symbol=${symbol}`
		)
		return response.data;
	} catch (error) {
		console.error("Error Response:", error.response.data);
		throw new Error(
			error.response.data.message ||
				"Something went wrong with the server."
		);
	}
};


export const AddStocksToWatchlist = async (watchlistId, symbol, note, targetPrice ) => {

	if (!watchlistId) {
		throw new Error("Missing required parameters : watchlistId");
	}

	if(!symbol){
		throw new Error("Missing required parameters : symbol");
	}

	const storedUser = localStorage.getItem("authUser");
	const parsedUser = storedUser ? JSON.parse(storedUser) : null;
	const token = parsedUser?.token;

	if(!token){
		throw new Error("User not authenticated.");
	}

	try {
		const response = await axios.post(`/watchlist/${watchlistId}/stock`, {
			symbol,
			note,
			targetPrice
		}, {
			headers: {
				"Authorization": `Bearer ${token}`,
			},
		});
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error("Error Response:", error.response.data);
		throw new Error(
			error.response.data.message ||
				"Something went wrong with the server."
		);
	}
};