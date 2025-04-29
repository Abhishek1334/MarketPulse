import React, { useEffect, useState } from "react";
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
	const [confirmDateChange, setConfirmDateChange] = useState(false); // Track confirmation of date change

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

	// Send the API request only after the user confirms the date change
	useEffect(() => {
		if (confirmDateChange) {
			addToQueue(
				symbol,
				selectedParams.interval,
				selectedParams.range,
				startDate,
				endDate
			);
			setConfirmDateChange(false); // Reset after sending the request
		}
	}, [
		confirmDateChange,
		symbol,
		selectedParams.interval,
		selectedParams.range,
		startDate,
		endDate,
	]);

	const handleConfirmDateChange = () => {
		setConfirmDateChange(true);
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
					handleConfirmDateChange={handleConfirmDateChange} // Pass handler to DatePicker
				/>
			</div>
			{/* Chart Rendering */}
			<div className="h-[400px] relative">
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
	);
};

export default ChartSection;
