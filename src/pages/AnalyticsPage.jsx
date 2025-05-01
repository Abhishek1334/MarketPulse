import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowUp,
	ArrowDown,
	Clock,
	Activity,
	TrendingUp,
	DollarSign,
	BarChart2,
	Loader2,
} from "lucide-react";
import useRateLimitedFetch from "../service/RateLimiting";
import { useAnalyticsStore } from "@/context/AnalyticsStore";
import ChartSection from "../components/Analytics/ChartSection";
import { makeCacheKey } from "../service/RateLimiting";

const AnalyticsPage = () => {
	const { symbol } = useParams();
	const [processedData, setProcessedData] = useState([]);
	const [error, setError] = useState(null);
	const { addToQueue, results, isFetching } = useRateLimitedFetch();
	const navigate = useNavigate();

	const { period1, period2, selectedInterval, setStockData } =
		useAnalyticsStore();

	const requestKey = useMemo(
		() => makeCacheKey(symbol, selectedInterval, period1, period2),
		[symbol, selectedInterval, period1, period2]
	);

	useEffect(() => {
		setError(null); // Reset error on new request
		addToQueue(symbol, selectedInterval, period1, period2);
	}, [requestKey, addToQueue, symbol, selectedInterval, period1, period2]);

	useEffect(() => {
		const result = results[requestKey];

		if (!result) {
			setProcessedData([]);
			return;
		}

		if (result.error) {
			setError(result.error);
			setProcessedData([]);
			setStockData([]);
			return;
		}

		setError(null);
		const rawData = result.values || [];

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

		setProcessedData(cleanData);
		setStockData(cleanData);
	}, [results, requestKey, setStockData]);

	const latestPrice = useMemo(
		() => processedData[0]?.close.toFixed(2) || "--",
		[processedData]
	);

	const priceChange = useMemo(() => {
		if (processedData.length < 2) return null;
		return (processedData[0].close - processedData[1].close).toFixed(2);
	}, [processedData]);

	const percentChange = useMemo(() => {
		if (processedData.length < 2) return null;
		return (
			((processedData[0].close - processedData[1].close) /
				processedData[1].close) *
			100
		).toFixed(2);
	}, [processedData]);

	const isPriceUp = priceChange > 0;

	const metrics = {
		open: processedData[0]?.open,
		close: processedData[0]?.close,
		high: processedData[0]?.high,
		low: processedData[0]?.low,
		volume: processedData[0]?.volume,
	};

	return (
		<div className="min-h-screen bg-[var(--background-50)] p-4 md:p-6 lg:p-8">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Error Display */}
				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
						Error loading data: {error}
					</div>
				)}

				{/* Header Section */}
				<div className="bg-[var(--background-100)] rounded-xl shadow-sm p-6 border border-[var(--background-200)]">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<div className="flex items-center gap-2">
								<TrendingUp className="h-6 w-6 text-purple-600" />
								<h1 className="text-2xl md:text-3xl font-bold text-[var(--text-950)]">
									{symbol}
								</h1>
							</div>
							<p className="text-[var(--text-600)] mt-1">
								{isFetching
									? "Fetching latest data..."
									: "Real-time market analysis"}
							</p>
						</div>
						<div className="flex items-center gap-4">
							<div className="text-right max-md:text-left">
								<div className="flex items-center gap-2">
									<p className="text-3xl font-bold text-[var(--text-900)]">
										${latestPrice}
									</p>
									{isFetching && (
										<Loader2 className="h-5 w-5 animate-spin text-gray-500" />
									)}
								</div>
								{priceChange && (
									<div
										className={`flex items-center gap-1 ${
											isPriceUp
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										{isPriceUp ? (
											<ArrowUp className="h-4 w-4" />
										) : (
											<ArrowDown className="h-4 w-4" />
										)}
										<span className="font-medium">
											${Math.abs(priceChange)} (
											{percentChange}%)
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Stats Cards */}
					<div className="lg:col-span-1 space-y-6">
						{isFetching ? (
							// Loading skeleton for stats
							<div className="bg-[var(--background-100)] rounded-xl shadow-sm p-6 border border-[var(--background-200)] animate-pulse">
								<div className="space-y-4">
									{[...Array(5)].map((_, i) => (
										<div
											key={i}
											className="h-4 bg-gray-200 rounded w-full"
										/>
									))}
								</div>
							</div>
						) : processedData[0] ? (
							<>
								<div className="bg-[var(--background-100)] rounded-xl shadow-sm p-6 border border-[var(--background-200)]">
									<div className="flex items-center justify-between mb-4">
										<h3 className="font-semibold text-[var(--text-950)]">
											Latest Session
										</h3>
										<Activity className="h-5 w-5 text-purple-600" />
									</div>
									<div className="space-y-3">
										{Object.entries(metrics).map(
											([key, value]) => (
												<div
													key={key}
													className="flex items-center justify-between"
												>
													<span className="text-[var(--text-600)]">
														{key.toUpperCase()}
													</span>
													<span className="text-[var(--text-950)] font-medium">
														${value}
													</span>
												</div>
											)
										)}
									</div>
								</div>

								
							</>
						) : null}
					</div>

					{/* Chart Section */}
					<div className="lg:col-span-3">
						<div className="bg-[var(--background-100)] rounded-xl shadow-sm p-6 border border-[var(--background-200)] h-[500px]">
							{error ? (
								<div className="h-full flex items-center justify-center text-red-500">
									Error loading chart data
								</div>
							) : isFetching ? (
								<div className="h-full flex items-center justify-center">
									<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
								</div>
							) : processedData.length > 0 ? (
								<ChartSection data={processedData} />
							) : (
								<div className="h-full flex items-center justify-center text-gray-500">
									No data available
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AnalyticsPage;
