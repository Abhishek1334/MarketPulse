import React from "react";
import { Line } from "react-chartjs-2";
import { useAnalyticsStore } from "@/context/AnalyticsStore";
import MetricSelector from "./MetricSelector";
import DatePicker from "./DatePicker";

const ChartSection = ({
	chartData,
	isLoading,
	selectedMetric,
	handleMetricChange,
	metrics,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
}) => {
	const { timeframe: selectedTimeframe } = useAnalyticsStore();

	const formatLabel = (datetime) => {
		if (["5M", "30M", "1H", "4H"].includes(selectedTimeframe)) {
			return datetime.slice(11, 16);
		} else if (["1D", "1W"].includes(selectedTimeframe)) {
			return datetime.slice(0, 10);
		}
		return datetime.slice(0, 7);
	};

	const chartDataset = {
		labels: chartData.map((item) => formatLabel(item.name)),
		datasets: [
			{
				label: selectedMetric.toUpperCase(),
				data: chartData.map((item) => item[selectedMetric]),
				fill: true,
				backgroundColor: "rgba(99, 102, 241, 0.1)",
				borderColor: "rgba(99, 102, 241, 1)",
				tension: 0.4,
				pointRadius: 1,
				pointHoverRadius: 5,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			tooltip: {
				mode: "index",
				intersect: false,
				backgroundColor: "rgba(255, 255, 255, 0.9)",
				titleColor: "#1f2937",
				bodyColor: "#1f2937",
				borderColor: "rgba(229, 231, 235, 1)",
				borderWidth: 2,
			},
			animation: isLoading
				? false
				: {
						duration: 800,
						easing: "easeInOutQuart",
				  },
		},
		scales: {
			y: {
				beginAtZero: false,
				grid: { color: "rgba(229, 231, 235, 0.5)" },
				ticks: { color: "#6b7280" },
			},
			x: {
				grid: { display: false },
				ticks: { color: "#6b7280", maxRotation: 0 },
			},
		},
		interaction: {
			intersect: false,
			mode: "index",
		},
	};

	return (
		<div className="bg-[var(--background-50)] rounded-xl shadow-sm p-6">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-lg font-semibold text-[var(--text-950)]">
					Price Chart
				</h2>
				{/* Metric Selector */}
				<MetricSelector
					selectedMetric={selectedMetric}
					handleMetricChange={handleMetricChange}
					metrics={metrics}
				/>
				{/* Date Picker */}
				<DatePicker
					startDate={startDate}
					setStartDate={setStartDate}
					endDate={endDate}
					setEndDate={setEndDate}
				/>
			</div>
			<div className="h-[400px] relative">
				<div className="h-[400px] relative ">
					{isLoading ? (
						<div className="absolute inset-0 flex items-center justify-center bg-[var(--background-50)]">
							<div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
						</div>
					) : chartData.length === 0 ? (
						<div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
							No data found for this timeframe.
						</div>
					) : (
						<Line data={chartDataset} options={chartOptions} />
					)}
				</div>
			</div>

			{chartData.length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6 text-sm text-[var(--text-700)] font-semibold">
					{["open", "high", "low", "close", "volume"].map((key) => (
						<div
							key={key}
							className="flex flex-col items-center justify-center bg-[var(--background-50)] rounded-md py-3 px-2 shadow-sm"
						>
							<p className="uppercase text-xs tracking-wider text-indigo-600">
								{key}
							</p>
							<p className="text-[var(--text-950)] text-base">
								{chartData[chartData.length - 1][key].toFixed(
									2
								)}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ChartSection;
