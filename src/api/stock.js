import axios from "./axiosInstance.js";



export const AddStocksToWatchlist = async (watchlistId, symbol, note, targetPrice ) => {

	if (!watchlistId) {
		throw new Error("Missing required parameters : watchlistId");
	}

	if(!symbol){
		throw new Error("Missing required parameters : symbol");
	}

	const storedState = localStorage.getItem("stock-dashboard-store");
const parsedState = storedState ? JSON.parse(storedState) : null;
const token = parsedState?.state?.user?.token;

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