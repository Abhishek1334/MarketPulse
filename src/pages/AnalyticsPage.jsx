import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import useRateLimitedFetch from "../service/RateLimiting"; // Importing the rate-limited hook
import { useQuery } from "@tanstack/react-query";
import useStore from "@/context/Store";
import { showSuccess, showError } from "@/utils/toast";
import { getTimeSeriesStockDatafromExternalAPI } from "@/api/analyse";

const AnalyticsPage = () => {
	const [chartData, setChartData] = useState([]);
	const [selectedMetric, setSelectedMetric] = useState("recent_price");

	const { watchlistId, stockId } = useParams();
	const watchlist = useStore((state) => state.watchlists).find(
		(w) => w._id === watchlistId
	);
	const stock = watchlist?.stocks.find((s) => s._id === stockId);

	// Use rate-limited fetching hook
	const { addToQueue, results } = useRateLimitedFetch();

	// If there's a stock symbol, add it to the queue for rate-limited fetching
	useEffect(() => {
		if (stock?.symbol) {
			console.log(`Adding symbol ${stock.symbol} to queue`);
			addToQueue(stock.symbol);
		}
	}, [addToQueue, stock?.symbol]);

	// Use react-query for the initial data fetch
	const {
		data: fetchedStockData,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["stock", stock?.symbol],
		queryFn: () => getTimeSeriesStockDatafromExternalAPI(stock?.symbol),
		enabled: !!stock?.symbol,
		staleTime: 1 * 60 * 1000, // ⏱️ 5 minutes
		cacheTime: 10 * 60 * 1000, // Optional: Keep it in memory for 10 minutes
		onSuccess: (data) => {
			console.log("Fetched stock data:", data);
			if (data?.error) showError(data.error);
			else showSuccess(data.message);
		},
		onError: () => {
			console.error("Failed to fetch stock data:", error); // Debugging error

			showError("Failed to fetch stock data.");
		},
	});

	// Process fetched data into chart data
	useEffect(() => {
		if (fetchedStockData?.values) {
			const data = fetchedStockData.values.map((item) => ({
				name: item.datetime,
				recent_price: parseFloat(item.close),
			}));

			setChartData(data.reverse()); // Left-to-right: old to new
		}
	}, [fetchedStockData]);

	useEffect(() => {
		console.log("Results from rate-limited fetch:", results);
	}, [results]);

	if (isError) {
		return (
			<div className="flex justify-center items-center h-screen text-red-600">
				{error.message || "Something went wrong fetching stock data."}
			</div>
		);
	}
	console.log("Results from rate-limited fetch:", results); // Debugging results

	// Handle metric selection change (e.g., SMA, EMA in the future)
	const handleMetricChange = (metric) => setSelectedMetric(metric);

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-8">
			<h1 className="text-3xl font-bold text-gray-800">
				Stock Analytics
			</h1>

			{stock && (
				<div className="bg-white shadow rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-4">Stock Info</h2>
					<ul className="space-y-1 text-gray-700">
						<li>
							<strong>Symbol:</strong> {stock.symbol}
						</li>
						<li>
							<strong>Target Price:</strong> ${stock.targetPrice}
						</li>
						<li>
							<strong>Note:</strong> {stock.note}
						</li>
						<li>
							<strong>Added:</strong>{" "}
							{new Date(stock.addedAt).toLocaleString()}
						</li>
					</ul>
				</div>
			)}

			<div className="bg-white shadow rounded-lg p-6 space-y-4">
				<div className="flex justify-between items-center">
					<h3 className="text-xl font-semibold">Select Metric</h3>
					<select
						className="border border-gray-300 rounded p-2"
						value={selectedMetric}
						onChange={(e) => handleMetricChange(e.target.value)}
					>
						<option value="recent_price">Recent Price</option>
						{/* Future options when implemented:
              <option value="SMA">SMA</option>
              <option value="EMA">EMA</option>
            */}
					</select>
				</div>

				{isLoading ? (
					<div className="h-64 flex justify-center items-center">
						Loading stock chart...
					</div>
				) : (
					<div className="h-64 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									dataKey="name"
									tickFormatter={(value) =>
										value.slice(11, 16)
									} // Show only HH:MM
								/>
								<YAxis />
								<Tooltip />
								<Legend />
								<Line
									type="monotone"
									dataKey={selectedMetric}
									stroke="#4f46e5"
									activeDot={{ r: 6 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				)}
			</div>
		</div>
	);
};

export default AnalyticsPage;
