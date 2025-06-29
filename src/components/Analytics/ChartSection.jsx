import { useEffect, useState, useRef } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";

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
	const [isDarkMode, setIsDarkMode] = useState(false);
	const chartRef = useRef(null);

	// Cleanup chart on unmount
	useEffect(() => {
		return () => {
			if (chartRef.current) {
				chartRef.current.destroy();
			}
		};
	}, []);

	// Check for dark mode changes
	useEffect(() => {
		const checkDarkMode = () => {
			setIsDarkMode(document.documentElement.classList.contains('dark'));
		};

		// Initial check
		checkDarkMode();

		// Watch for changes
		const observer = new MutationObserver(checkDarkMode);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});

		return () => observer.disconnect();
	}, []);

	const stockData = data;

	const labels = stockData.map((entry) =>
		new Date(entry.date).toLocaleDateString("en-US", {
			day: "2-digit",
			month: "short",
		})
	);

	const values = stockData.map((entry) => entry[selectedMetric]);

	// Dynamic colors based on theme
	const getChartColors = () => {
		if (isDarkMode) {
			return {
				borderColor: "rgb(192, 132, 252)", // --primary-400
				backgroundColor: "rgba(192, 132, 252, 0.1)",
				pointBackgroundColor: "rgb(192, 132, 252)",
				pointHoverBackgroundColor: "rgb(168, 85, 247)", // --primary-500
				pointBorderColor: "#1e2128", // --background-200
				pointHoverBorderColor: "#242831", // --background-300
			};
		}
		return {
			borderColor: "rgb(168, 85, 247)", // --primary-500
			backgroundColor: "rgba(168, 85, 247, 0.1)",
			pointBackgroundColor: "rgb(168, 85, 247)",
			pointHoverBackgroundColor: "rgb(147, 51, 234)", // --primary-600
			pointBorderColor: "#ffffff",
			pointHoverBorderColor: "#ffffff",
		};
	};

	const chartColors = getChartColors();

	const chartData = {
		labels,
		datasets: [
			{
				label:
					selectedMetric.charAt(0).toUpperCase() +
					selectedMetric.slice(1),
				data: values,
				borderColor: chartColors.borderColor,
				backgroundColor: chartColors.backgroundColor,
				tension: 0.4,
				fill: true,
				pointRadius: 0,
				pointHoverRadius: 6,
				pointBackgroundColor: chartColors.pointBackgroundColor,
				pointHoverBackgroundColor: chartColors.pointHoverBackgroundColor,
				pointBorderColor: chartColors.pointBorderColor,
				pointHoverBorderColor: chartColors.pointHoverBorderColor,
				pointBorderWidth: 2,
				pointHoverBorderWidth: 2,
			},
		],
	};

	const getChartOptions = () => {
		const baseOptions = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					mode: "index",
					intersect: false,
					backgroundColor: isDarkMode 
						? "rgba(30, 33, 40, 0.95)" // --background-200 with opacity
						: "rgba(255, 255, 255, 0.95)",
					titleColor: isDarkMode 
						? "#f8fafc" // --text-50
						: "#0f172a", // --text-900
					bodyColor: isDarkMode 
						? "#e2e8f0" // --text-100
						: "#334155", // --text-700
					borderColor: isDarkMode 
						? "rgba(71, 85, 105, 0.8)" // --background-400
						: "rgba(203, 213, 225, 0.8)", // --background-300
					borderWidth: 1,
					padding: 12,
					boxPadding: 6,
					usePointStyle: true,
					cornerRadius: 8,
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
							size: window.innerWidth < 768 ? 10 : 12,
							weight: '500',
						},
						color: isDarkMode 
							? "#cbd5e1" // --text-200
							: "#475569", // --text-600
						maxRotation: 45,
						minRotation: 0,
					},
				},
				y: {
					grid: {
						color: isDarkMode 
							? "rgba(203, 213, 225, 0.15)" // --text-200 with low opacity
							: "rgba(156, 163, 175, 0.2)", // --text-400 with low opacity
						drawBorder: false,
					},
					ticks: {
						font: {
							size: window.innerWidth < 768 ? 10 : 12,
							weight: '500',
						},
						color: isDarkMode 
							? "#cbd5e1" // --text-200
							: "#475569", // --text-600
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

		return baseOptions;
	};

	const chartOptions = getChartOptions();

	return (
		<Card className="bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm border-[var(--background-200)] dark:border-[var(--background-300)] shadow-xl transition-all duration-300">
			<CardHeader className="pb-4 px-4 sm:px-6">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-lg flex items-center justify-center">
							<BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
						</div>
						<div>
							<CardTitle className="text-lg sm:text-xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
								Price Chart
							</CardTitle>
							<p className="text-xs sm:text-sm text-[var(--text-600)] dark:text-[var(--text-400)] mt-1">
								Interactive {selectedMetric} data visualization
							</p>
						</div>
					</div>
					<div className="w-full sm:w-auto">
						<MetricSelector />
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-4 sm:p-6">
				<div className="h-[300px] sm:h-[400px] transition-all duration-300">
					<Line data={chartData} options={chartOptions} ref={chartRef} />
				</div>
			</CardContent>
		</Card>
	);
};

export default ChartSection;
