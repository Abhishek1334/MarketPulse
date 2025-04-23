import axios from "axios";

const makeRequest = async (symbol) => {
	const token =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODAyNTQ2YzQ1NjI5MWIzMGFjZjA0MDUiLCJpYXQiOjE3NDU0MjU3MDAsImV4cCI6MTc0NTUxMjEwMH0.YDZc5WH2CURbpJ8HRoNOio9-ITwCWXJgtAvVWuW0cX4";

	if (!token) {
		throw new Error("User not authenticated.");
	}

	try {
		const response = await axios.get(
			`http://localhost:5000/api/stock/timeseries?symbol=${symbol}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		console.log(response.status);
	} catch (error) {
		console.error(
			`Error: ${error.response ? error.response.data : error.message}`
		);
	}
};

const testRateLimiter = async () => {
	const symbol = "TSLA";
	const numRequests = 15; // The number of requests to send

	// Send the requests with a small delay between each to simulate real traffic
	for (let i = 0; i < numRequests; i++) {
		await makeRequest(symbol);
		await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay between requests
	}
};

testRateLimiter();
