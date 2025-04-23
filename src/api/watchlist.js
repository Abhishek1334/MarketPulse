import axios from "./axiosInstance.js";


export const getWatchlistsByUser = async () => {
	try {
		// Get the token from localStorage
		const storedUser = localStorage.getItem("authUser");
		const parsedUser = storedUser ? JSON.parse(storedUser) : null;
		const token = parsedUser?.token;

		if (!token) {
			throw new Error("User not authenticated.");
		}

		const response = await axios.get("/watchlist", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error Response:", error.response?.data || error.message);
		throw new Error(
			error.message ||
				"Something went wrong with the server."
		);
	}
};

export const getASingleWatchlist = async (watchlistId) => {

	if (!watchlistId) {
		throw new Error("Missing required parameters : watchlistId");
	}

	const storedUser = localStorage.getItem("authUser");
	const parsedUser = storedUser ? JSON.parse(storedUser) : null;
	const token = parsedUser?.token;

	if(!token){
		throw new Error("User not authenticated.");
	}

	try{
		const response = await axios.get(`/watchlist/${watchlistId}`, {
			headers: {
				"Authorization": `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error Response:", error.response.data);
		throw new Error(error.response.data.message || "Something went wrong with the server.");
	}
	
};


export const CreateAWatchlist = async (name , stocks) => {
	try {
		const storedUser = localStorage.getItem("authUser");
		const parsedUser = storedUser ? JSON.parse(storedUser) : null;
		const token = parsedUser?.token;

		if (!token) {
			throw new Error("User not authenticated.");
		}

		if (!name) {
			throw new Error("Missing required parameters.");
		}

		if(!Array.isArray(stocks) || stocks.length === 0){
			stocks = [];
		}
		const response = await axios.post("/watchlist", {
			name,stocks
		}, {
			headers: {
				"Authorization": `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw new Error(error.response.data.message || "Something went wrong with the server.");
	}
};


export const updateWatchlistName = async (watchlistId, newName) => {
	try {
		const storedUser = localStorage.getItem("authUser");
		const parsedUser = storedUser ? JSON.parse(storedUser) : null;
		const token = parsedUser?.token;

		if (!token) {
			throw new Error("User not authenticated.");
		}

		if (!watchlistId || !newName) {
			throw new Error("Missing required parameters.");
		}

		const response = await axios.put(`/watchlist/${watchlistId}`, {
			name: newName,
		}, {
			headers: {
				"Authorization": `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error Response:", error.response.data);
		throw new Error(error.response.data.message || "Something went wrong with the server.");
	}
};


export const DeleteAWatchlist = async (watchlistId) => {
	try {
		const storedUser = localStorage.getItem("authUser");
		const parsedUser = storedUser ? JSON.parse(storedUser) : null;
		const token = parsedUser?.token;

		if (!token) {
			throw new Error("User not authenticated.");
		}

		if(!watchlistId){
			throw new Error("Missing required parameters.");
		}

		const response = await axios.delete(`/watchlist/${watchlistId}`, {
			headers: {
				"Authorization": `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error Response:", error.response.data);
		throw new Error(error.response.data.message || "Something went wrong with the server.");
	}
};

