import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from "chart.js";

import useRateLimitedFetch from "../service/RateLimiting";
import useStore from "@/context/Store";
import { useAnalyticsStore } from "@/context/AnalyticsStore";

import StockDetailsCard from "@/components/Analytics/StockDetailsCard";
import MarketHoursCard from "@/components/Analytics/MarketHoursCard";
import ChartSection from "@/components/Analytics/ChartSection";
import VolumeAnalysis from "@/components/Analytics/VolumeAnalysis";
import TechnicalIndicators from "@/components/Analytics/TechnicalIndicators";
import TimeframePicker from "@/components/Analytics/TimeframePicker";
import AnalyticsHeader from "@/components/Analytics/AnalyticsHeader";
import BackButton from "@/components/BackButton";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

const timeframeToYahooParams = {
	"1D": { interval: "1d", range: "1mo" },
	"1W": { interval: "1wk", range: "6mo" },
	"1M": { interval: "1mo", range: "max" },
};

const AnalyticsPage = () => {
	const { symbol } = useParams();
	const {
		startDate,
		endDate,
		setStartDate,
		setEndDate,
		setMetric,
		timeframe: selectedTimeframe,
		metric: selectedMetric,
	} = useAnalyticsStore();

	const { watchlists } = useStore((state) => state);

	const stockInWatchlist = watchlists
		.flatMap((watchlist) => watchlist.stocks)
		.find((stock) => stock.symbol === symbol);

	const [chartData, setChartData] = useState([]);

	const { addToQueue, results, isLoading, isError, error } =
		useRateLimitedFetch();

	const selectedParams = timeframeToYahooParams[selectedTimeframe];

	const requestKey = `${symbol}-${selectedParams.interval}-${
		selectedParams.range
	}-${startDate || ""}-${endDate || ""}`;

	const fetchedStockData = useMemo(
		() => results[requestKey],
		[results, requestKey]
	);

	useEffect(() => {
		console.log("symbol", symbol); // Check if symbol is changing unexpectedly
		if (symbol) {
			setChartData([]);
			addToQueue(
				symbol,
				selectedParams.interval,
				selectedParams.range,
				startDate,
				endDate
			);
		}
	}, [
		symbol,
		selectedParams.interval,
		selectedParams.range,
		startDate,
		endDate,
	]);


	useEffect(() => {
		if (fetchedStockData?.values?.length) {
			const data = fetchedStockData.values.map((item) => ({
				name: item.datetime,
				open: parseFloat(item.open),
				high: parseFloat(item.high),
				low: parseFloat(item.low),
				close: parseFloat(item.close),
				volume: parseFloat(item.volume),
			}));
			setChartData(data);
		}
	}, [fetchedStockData]);

	const handleMetricChange = (metric) => setMetric(metric);

	const latest = chartData.at(-1)?.[selectedMetric];
	const prev = chartData.at(-2)?.[selectedMetric];
	const priceChange = latest && prev ? ((latest - prev) / prev) * 100 : null;
	const isUp = priceChange > 0;

	if (isError) {
		return (
			<div className="flex flex-col gap-4 justify-center items-center h-[90vh] text-lg text-red-600">
				{error?.message || "Something went wrong fetching stock data."}
				<BackButton locationAddress="" locationName="Watchlist" />
			</div>
		);
	}

	if (isLoading || !fetchedStockData) {
		return (
			<div className="flex flex-col gap-4 justify-center items-center h-[90vh] text-lg text-gray-600">
				<div className="animate-spin rounded-full size-10 border-t-2 border-b-2 border-gray-600"></div>
				Loading...
			</div>
		);
	}

	const metrics = ["open", "high", "low", "close", "volume"];

	return (
		<div className="bg-[var(--background-100)] p-4 md:p-6 lg:p-8">
			<div className="max-w-7xl mx-auto space-y-6">
				<BackButton locationAddress="" locationName="" />

				{/* Header */}
				<div className="flex max-md:flex-col max-md:flex-wrap max-md:gap-4 items-center justify-between bg-[var(--background-50)] rounded-xl shadow-sm p-4 md:p-6">
					<AnalyticsHeader
						symbol={symbol}
						exchange={fetchedStockData?.meta?.exchange || ""}
						latest={latest}
						priceChange={priceChange}
						isUp={isUp}
					/>
					<TimeframePicker />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* Stock Details Card */}
					<div className="lg:col-span-3 space-y-6">
						{stockInWatchlist && (
							<StockDetailsCard stock={stockInWatchlist} />
						)}
						<MarketHoursCard />
					</div>

					{/* Chart Section */}
					<div className="lg:col-span-9 space-y-6">
						<ChartSection
							chartData={chartData}
							isLoading={isLoading}
							selectedMetric={selectedMetric}
							handleMetricChange={handleMetricChange}
							metrics={metrics}
							startDate={startDate}
							setStartDate={setStartDate}
							endDate={endDate}
							setEndDate={setEndDate}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<VolumeAnalysis />
							<TechnicalIndicators />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AnalyticsPage;
