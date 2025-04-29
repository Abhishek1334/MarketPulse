import axios from "./axiosInstance.js";


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
			`/stock/getStock?symbol=${symbol}`,
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

export const getStockDataforWatchlist = async (symbols) => {
	const storedState = localStorage.getItem("stock-dashboard-store");
	const parsedState = storedState ? JSON.parse(storedState) : null;
	const token = parsedState?.state?.user?.token;

	if (!token) {
		throw new Error("User not authenticated.");
	}

	if (!symbols || symbols.length === 0) {
		throw new Error("At least one symbol is required.");
	}

	try {
		// Join symbols array into a comma-separated string
		const symbolsString = symbols.join(",");

		const response = await axios.get(`/stock/getStockforWatchlist`, {
			params: { symbols: symbolsString }, // Use a comma-separated string
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error Response:", error.response?.data || error.message);
		throw new Error(
			error.response?.data?.message ||
				"Something went wrong with the server."
		);
	}
};


export const getTimeSeriesStockDatafromExternalAPI = async (
	symbol,
	interval = "1d",
	range,
	startDate,
	endDate
) => {
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
			`/stock/chart?symbol=${symbol}&interval=${interval}&startDate=${startDate}&endDate=${endDate}&range=${range}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data;
	} catch (error) {
		console.error(
			"Error fetching chart data:",
			error?.response?.data || error.message
		);
		throw new Error(
			error?.response?.data?.message ||
				"Something went wrong while fetching chart data."
		);
	}
};



export const searchStocksfromExternalAPI = async (query) => {
	const storedState = localStorage.getItem("stock-dashboard-store");
	const parsedState = storedState ? JSON.parse(storedState) : null;

	const token = parsedState?.state?.user?.token;

	if (!token) {
		throw new Error("User not authenticated.");
	}

	try {
		if(!query)return [];

		const res = await axios.get(
			`/stock/search?query=${encodeURIComponent(query)}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return res.data;
	} catch (error) {
		console.error("Error Response:", error.response.data);
		throw new Error(
			error.response.data.message ||
				"Something went wrong with the server."
		);
	}
};

