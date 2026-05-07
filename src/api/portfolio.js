import axios from "./axiosInstance.js";

const getToken = () => {
	const storedState = localStorage.getItem("stock-dashboard-store");
	const parsedState = storedState ? JSON.parse(storedState) : null;
	const token = parsedState?.state?.user?.token;
	if (!token) throw new Error("User not authenticated.");
	return token;
};

const authConfig = () => ({
	headers: { Authorization: `Bearer ${getToken()}` },
});

export const fetchPortfolio = async () => {
	const { data } = await axios.get("/portfolio", authConfig());
	return data;
};

export const apiAddHolding = async (holding) => {
	const { data } = await axios.post("/portfolio/holdings", holding, authConfig());
	return data;
};

export const apiUpdateHolding = async (holdingId, updates) => {
	const { data } = await axios.put(
		`/portfolio/holdings/${holdingId}`,
		updates,
		authConfig()
	);
	return data;
};

export const apiDeleteHolding = async (holdingId) => {
	const { data } = await axios.delete(
		`/portfolio/holdings/${holdingId}`,
		authConfig()
	);
	return data;
};

export const apiAddTransaction = async (transaction) => {
	const { data } = await axios.post(
		"/portfolio/transactions",
		transaction,
		authConfig()
	);
	return data;
};

export const apiUpdatePortfolioSettings = async (settings) => {
	const { data } = await axios.put("/portfolio/settings", settings, authConfig());
	return data;
};

export const apiImportPortfolio = async (payload) => {
	const { data } = await axios.post("/portfolio/import", payload, authConfig());
	return data;
};

export const fetchBatchQuotes = async (symbols) => {
	if (!Array.isArray(symbols) || symbols.length === 0) return [];
	const params = { symbols: symbols.join(",") };
	const { data } = await axios.get("/stock/getStockforWatchlist", {
		...authConfig(),
		params,
	});
	return Array.isArray(data) ? data : [];
};
