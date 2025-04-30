// ChartSection.jsx (simplified)
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS /* ... */ } from "chart.js";
import { useAnalyticsStore } from "@/context/AnalyticsStore";

ChartJS.register(/* ... */);

const chartOptions = {
	/* ... */
};

const ChartSection = ({
	chartData,
	isLoading,
	selectedMetric,
	handleMetricChange,
	metrics,
}) => {
	return (
		<div className="bg-[var(--background-50)] rounded-xl shadow-sm p-6">
			<div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
				<h2 className="text-lg font-semibold text-[var(--text-950)]">
					Price Chart
				</h2>
				<MetricSelector
					selectedMetric={selectedMetric}
					handleMetricChange={handleMetricChange}
					metrics={metrics}
				/>
			</div>

			<div className="h-[400px] relative">
				{isLoading ? (
					<div className="absolute inset-0 flex items-center justify-center bg-[var(--background-50)]">
						<div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
					</div>
				) : chartData.length === 0 ? (
					<div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 text-sm gap-2">
						<span>No data available</span>
					</div>
				) : (
					<Line
						data={{
							labels: chartData.map((item) =>
								new Date(item.name).toLocaleDateString()
							),
							datasets: [
								{
									label: selectedMetric.toUpperCase(),
									data: chartData.map(
										(item) => item[selectedMetric]
									),
									borderColor: "rgba(99, 102, 241, 1)",
									backgroundColor: "rgba(99, 102, 241, 0.1)",
									tension: 0.4,
									pointRadius: 3,
									pointHoverRadius: 5,
									borderWidth: 2,
								},
							],
						}}
						options={chartOptions}
					/>
				)}
			</div>
		</div>
	);
};

export default ChartSection;
