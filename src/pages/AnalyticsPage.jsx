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
} from "lucide-react";
import useRateLimitedFetch from "../service/RateLimiting";
import { useAnalyticsStore } from "@/context/AnalyticsStore";
import ChartSection from "../components/Analytics/ChartSection";
import { makeCacheKey } from "../service/RateLimiting";

const AnalyticsPage = () => {
	const { symbol } = useParams();
	const [processedData, setProcessedData] = useState([]);
	const { addToQueue, results, isFetching } = useRateLimitedFetch();
	const navigate = useNavigate();

	const { period1, period2, selectedInterval, setStockData } =
		useAnalyticsStore();

	const requestKey = useMemo(
		() => makeCacheKey(symbol, selectedInterval, period1, period2),
		[symbol, selectedInterval, period1, period2]
	);

	useEffect(() => {
		addToQueue(symbol, selectedInterval, period1, period2);
	}, [requestKey, addToQueue, symbol, selectedInterval, period1, period2]);

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

		setProcessedData(cleanData);
		setStockData(cleanData);
	}, [results, requestKey]);

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
								Real-time market analysis
							</p>
						</div>
						<div className="flex items-center gap-4">
							<div className="text-right max-md:text-left">
								<p className="text-3xl font-bold text-[var(--text-900)]">
									${latestPrice}
								</p>
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
						{processedData[0] && (
							<>
								<div className="bg-[var(--background-100)] rounded-xl shadow-sm p-6 border border-[var(--background-200)]">
									<div className="flex items-center justify-between mb-4">
										<h3 className="font-semibold text-[var(--text-950)]">
											Latest Session
										</h3>
										<Activity className="h-5 w-5 text-purple-600" />
									</div>
									<div className="space-y-3">
										{/* Mapping over metrics obhect for open , close etc price  */}
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

								<div className="bg-[var(--background-100)] rounded-xl shadow-sm p-6 border border-[var(--background-200)]">
									<div className="flex items-center justify-between mb-4">
										<h3 className="font-semibold text-[var(--text-950)]">
											Market Status
										</h3>
										<Clock className="h-5 w-5 text-purple-600" />
									</div>
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
											<span className="text-green-600 font-medium">
												Market is Open
											</span>
										</div>
										<p className="text-[var(--text-600)] text-sm">
											Trading Hours:
										</p>
										<div className="space-y-2 text-base">
											<div className="flex justify-between items-center">
												<span className="text-[var(--text-500)]">
													Pre-Market
												</span>
												<span className="text-[var(--text-900)]">
													4:00 AM - 9:30 AM
												</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-[var(--text-500)]">
													Regular
												</span>
												<span className="text-[var(--text-900)]">
													9:30 AM - 4:00 PM
												</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-[var(--text-500)]">
													After Hours
												</span>
												<span className="text-[var(--text-900)]">
													4:00 PM - 8:00 PM
												</span>
											</div>
										</div>
									</div>
								</div>
							</>
						)}
					</div>

					{/* Chart Section */}
					<div className="lg:col-span-3">
						<div className="bg-[var(--background-100)] rounded-xl shadow-sm p-6 border border-[var(--background-200)]">
							<ChartSection data={processedData} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AnalyticsPage;
