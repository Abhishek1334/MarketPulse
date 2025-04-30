import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useRateLimitedFetch from "../service/RateLimiting";
import { useAnalyticsStore } from "@/context/AnalyticsStore";

const AnalyticsPage = () => {
	const { symbol } = useParams();
	const [processedData, setProcessedData] = useState([]);
	const { addToQueue, results, isFetching } = useRateLimitedFetch();
	const navigate = useNavigate();
	// Default filter values
	const defaultFilters = useMemo(
		() => ({
			interval: "1d",
			startDate: new Date(Date.now() - 30 * 86400000)
				.toISOString()
				.split("T")[0],
			endDate: new Date().toISOString().split("T")[0],
		}),
		[]
	);

	// Generate request key
	const requestKey = useMemo(
		() =>
			`${symbol}-${defaultFilters.interval}-${defaultFilters.startDate}-${defaultFilters.endDate}`,
		[symbol, defaultFilters]
	);

	// Fetch data on mount and symbol change
	useEffect(() => {
		addToQueue(
			symbol,
			defaultFilters.interval,
			defaultFilters.startDate,
			defaultFilters.endDate
		);
	}, [requestKey, addToQueue, symbol, defaultFilters]);

	// Process data when results change
	useEffect(() => {
		const rawData = results[requestKey]?.values || [];
		const cleanData = rawData
			.map((item) => ({
				date: new Date(item.datetime),
				open: Number(item.open),
				high: Number(item.high),
				low: Number(item.low),
				close: Number(item.close),
				volume: Number(item.volume),
			}))
			.filter((item) => !isNaN(item.close));
		console.log("Processed data:", cleanData);
		setProcessedData(cleanData);
	}, [results, requestKey]);

	// Get latest price info
	const latestPrice = useMemo(
		() => processedData[0]?.close.toFixed(2) || "--",
		[processedData]
	);

	return (
		<div className="flex flex-col items-center justify-center h-[90vh]">
			{/* Show under construction message */}
			<h1 className="text-3xl font-bold ">Under Construction</h1>
			<p className="text-lg font-medium">This page is currently under construction.</p>
			<button onClick={() => navigate(-1)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-6 py-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">Go Back</button>
		</div>
		// <div className="analytics-container">
		// 	<header className="analytics-header">
		// 		<h1>{symbol} Analytics</h1>
		// 		<div className="price-display">
		// 			<span className="price">{latestPrice}</span>
		// 		</div>
		// 	</header>

		// 	<main className="analytics-content">
		// 		<div className="chart-container">
		// 			<div className="chart-placeholder">
		// 				{/* Empty space for future chart implementation */}
		// 			</div>
		// 		</div>

		// 		<div className="info-cards">
		// 			<div className="info-card">
		// 				<h3>Latest Session</h3>
		// 				{processedData[0] ? (
		// 					<ul>
		// 						<li>
		// 							Open: ${processedData[0].open.toFixed(2)}
		// 						</li>
		// 						<li>
		// 							High: ${processedData[0].high.toFixed(2)}
		// 						</li>
		// 						<li>Low: ${processedData[0].low.toFixed(2)}</li>
		// 						<li>
		// 							Volume:{" "}
		// 							{processedData[0].volume.toLocaleString()}
		// 						</li>
		// 					</ul>
		// 				) : (
		// 					<p>No data available</p>
		// 				)}
		// 			</div>

		// 			<div className="info-card">
		// 				<h3>Market Status</h3>
		// 				<p className="market-open">Market is Open</p>
		// 				<p>Hours: 9:30 AM - 4:00 PM EST</p>
		// 			</div>
		// 		</div>
		// 	</main>
		// </div>
	);
};

export default AnalyticsPage;
