import axios from "./axiosInstance.js";


export const validateStockSymbol = async (symbol) => {

	const storedState = localStorage.getItem("stock-dashboard-store");
	const parsedState = storedState ? JSON.parse(storedState) : null;
	const token = parsedState?.state?.user?.token;

	if (!token) {
		throw new Error("User not authenticated.");
	}

	if (!symbol) {
		throw new Error("Symbol is required.");
	}
	try {
		const response = await axios.get(
			`/stock/validate?symbol=${symbol}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error(
			`Error validating stock symbol: ${symbol}`,
			error.message
		);
		throw new Error(`Failed to validate stock symbol: ${symbol}`);
	}
}



export const AddStockToWatchlist = async (watchlistId, symbol, note, targetPrice) => {
	if (!watchlistId) {
		throw new Error("Missing required parameters : watchlistId");
	}

	if (!symbol) {
		throw new Error("Missing required parameters : symbol");
	}
	if (!note) {
		note = "";
	}

	if (!targetPrice) {
		targetPrice = "";
	}
	console.log(watchlistId, symbol, note, targetPrice);

	const storedState = localStorage.getItem("stock-dashboard-store");
	const parsedState = storedState ? JSON.parse(storedState) : null;
	const token = parsedState?.state?.user?.token;

	if (!token) {
		throw new Error("User not authenticated.");
	}

	try {
		const response = await axios.post(
			`/watchlist/${watchlistId}/stock`,
			{
				symbol,
				note,
				targetPrice,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
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


export const AddStocksToWatchlist = async (watchlistId, symbol, note, targetPrice ) => {

	if (!watchlistId) {
		throw new Error("Missing required parameters : watchlistId");
	}

	if(!symbol){
		throw new Error("Missing required parameters : symbol");
	}

	if(!note){
		note = "";
	}
	
	if(!targetPrice){
		targetPrice = "";
	}
	console.log(watchlistId, symbol, note, targetPrice);
	const storedState = localStorage.getItem("stock-dashboard-store");
	const parsedState = storedState ? JSON.parse(storedState) : null;
	const token = parsedState?.state?.user?.token;

	if(!token){
		throw new Error("User not authenticated.");
	}

	try {
		const response = await axios.post(`/watchlist/${watchlistId}/stocks`, {
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


export const DeleteStockFromWatchlist = async (watchlistId, stockId) => {

	if (!watchlistId) {
		throw new Error("Missing required parameters : watchlistId");
	}	

	if(!stockId){
		throw new Error("Missing required parameters : stockId");
	}

	const storedState = localStorage.getItem("stock-dashboard-store");
const parsedState = storedState ? JSON.parse(storedState) : null;
const token = parsedState?.state?.user?.token;

	if(!token){
		throw new Error("User not authenticated.");
	}

	try {
		const response = await axios.delete(`/watchlist/${watchlistId}/stock/${stockId}`, {
			headers: {
				"Authorization": `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error Response:", error.response.data);
		throw new Error(
			error.response.data.message ||
				"Something went wrong with the server."
		);
	}
}

export const UpdateStockInWatchlist = async (watchlistId, stockId, note, targetPrice) => {

	if (!watchlistId) {
		throw new Error("Missing required parameters : watchlistId");
	}

	if(!stockId){
		throw new Error("Missing required parameters : stockId");
	}

	const storedState = localStorage.getItem("stock-dashboard-store");
const parsedState = storedState ? JSON.parse(storedState) : null;
const token = parsedState?.state?.user?.token;	

	if(!token){
		throw new Error("User not authenticated.");
	}

	try {
		const response = await axios.put(`/watchlist/${watchlistId}/stock/${stockId}`, {
			note,
			targetPrice
		}, {
			headers: {
				"Authorization": `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error Response:", error.response.data);
		throw new Error(
			error.response.data.message ||
				"Something went wrong with the server."
		);
	}
}