import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useAnalyticsStore } from "@/context/AnalyticsStore";
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
import MetricSelector from "./MetricSelector";

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

const ChartSection = () => {
	const data = useAnalyticsStore((state) => state.stockData);
	const selectedMetric = useAnalyticsStore((state) => state.selectedMetric);

	const stockData = data;

	const labels = stockData.map((entry) =>
		new Date(entry.date).toLocaleDateString("en-US", {
			day: "2-digit",
			month: "short",
		})
	);

	const values = stockData.map((entry) => entry[selectedMetric]);

	const chartData = {
		labels,
		datasets: [
			{
				label:
					selectedMetric.charAt(0).toUpperCase() +
					selectedMetric.slice(1),
				data: values,
				borderColor: "rgb(99, 102, 241)",
				backgroundColor: "rgba(99, 102, 241, 0.1)",
				tension: 0.4,
				fill: true,
				pointRadius: 0,
				pointHoverRadius: 6,
				pointBackgroundColor: "rgb(99, 102, 241)",
				pointHoverBackgroundColor: "rgb(99, 102, 241)",
				pointBorderColor: "#fff",
				pointHoverBorderColor: "#fff",
				pointBorderWidth: 2,
				pointHoverBorderWidth: 2,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				mode: "index",
				intersect: false,
				backgroundColor: "rgba(255, 255, 255, 0.9)",
				titleColor: "#1f2937",
				bodyColor: "#1f2937",
				borderColor: "rgba(229, 231, 235, 1)",
				borderWidth: 1,
				padding: 12,
				boxPadding: 6,
				usePointStyle: true,
				callbacks: {
					label: function (context) {
						return `${
							context.dataset.label
						}: $${context.parsed.y.toFixed(2)}`;
					},
				},
			},
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
				ticks: {
					font: {
						size: 12,
					},
					color: "#6b7280",
				},
			},
			y: {
				grid: {
					color: "rgba(229, 231, 235, 0.5)",
					drawBorder: false,
				},
				ticks: {
					font: {
						size: 12,
					},
					color: "#6b7280",
					callback: function (value) {
						return "$" + value.toFixed(2);
					},
				},
			},
		},
		interaction: {
			intersect: false,
			mode: "index",
		},
		elements: {
			line: {
				borderWidth: 2,
			},
		},
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-[var(--text-950)]">
					Price Chart
				</h2>
				<MetricSelector />
			</div>
			<div className="h-[400px]">
				<Line data={chartData} options={options} />
			</div>
		</div>
	);
};

export default ChartSection;
