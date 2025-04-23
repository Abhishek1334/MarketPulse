import axios from "./axiosInstance.js";

// Function to fetch stock data from external API
export const getStockDatafromExternalAPI = async (symbol) => {

	const storedState = localStorage.getItem("stock-dashboard-store");
	const parsedState = storedState ? JSON.parse(storedState) : null;

	const token = parsedState?.state?.user?.token;

	if(!token){
		throw new Error("User not authenticated.");
	}

	if(!symbol){
		throw new Error("Symbol is required.");
	}

	try {
		
		const response = await axios.get(
			`/stock/search?symbol=${symbol}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error Response:", error.response.data);
		throw new Error(
			error.response.data.message ||
				"Something went wrong with the server."
		);
	}
};


export const getTimeSeriesStockDatafromExternalAPI = async (symbol) => {
	const storedState = localStorage.getItem("stock-dashboard-store");
	const parsedState = storedState ? JSON.parse(storedState) : null;

	const token = parsedState?.state?.user?.token;

	if(!token){
		throw new Error("User not authenticated.");
	}

	if(!symbol){
		throw new Error("Symbol is required.");
	}

	try{
		const response = await axios.get(
			`/stock/timeseries?symbol=${symbol}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		console.log("Response:", response.data);
		return response.data;
	} catch (error) {
		console.error("Error Response:", error.response.data);
		throw new Error(
			error.response.data.message ||
				"Something went wrong with the server."
		)	
	}
}

