import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
	Filler
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
	TrendingUp, 
	TrendingDown, 
	Activity, 
	BarChart3, 
	Settings,
	Info,
	Zap,
	Target,
	AlertTriangle,
	CheckCircle,
	XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Register Chart.js elements
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

const TechnicalIndicators = ({ stockData, selectedMetric = 'close' }) => {
	const [selectedIndicator, setSelectedIndicator] = useState('rsi');
	const [showSettings, setShowSettings] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const chartRef = useRef(null);

	// Indicator settings
	const [settings, setSettings] = useState({
		rsi: { period: 14, overbought: 70, oversold: 30 },
		macd: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
		sma: { period: 20 },
		ema: { period: 20 },
		bollinger: { period: 20, stdDev: 2 }
	});

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

		checkDarkMode();
		const observer = new MutationObserver(checkDarkMode);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});

		return () => observer.disconnect();
	}, []);

	// Calculate RSI
	const calculateRSI = useMemo(() => {
		if (!stockData || stockData.length < settings.rsi.period + 1) return [];

		const prices = stockData.map(d => d[selectedMetric]).reverse();
		const gains = [];
		const losses = [];

		for (let i = 1; i < prices.length; i++) {
			const change = prices[i] - prices[i - 1];
			gains.push(change > 0 ? change : 0);
			losses.push(change < 0 ? Math.abs(change) : 0);
		}

		const avgGain = [];
		const avgLoss = [];
		const rsi = [];

		// Calculate initial averages
		let sumGain = gains.slice(0, settings.rsi.period).reduce((a, b) => a + b, 0);
		let sumLoss = losses.slice(0, settings.rsi.period).reduce((a, b) => a + b, 0);

		avgGain.push(sumGain / settings.rsi.period);
		avgLoss.push(sumLoss / settings.rsi.period);

		// Calculate RSI
		for (let i = settings.rsi.period; i < prices.length; i++) {
			const rs = avgGain[avgGain.length - 1] / avgLoss[avgLoss.length - 1];
			const currentRSI = 100 - (100 / (1 + rs));
			rsi.push(currentRSI);

			// Update averages
			const newAvgGain = (avgGain[avgGain.length - 1] * (settings.rsi.period - 1) + gains[i]) / settings.rsi.period;
			const newAvgLoss = (avgLoss[avgLoss.length - 1] * (settings.rsi.period - 1) + losses[i]) / settings.rsi.period;

			avgGain.push(newAvgGain);
			avgLoss.push(newAvgLoss);
		}

		return rsi.reverse();
	}, [stockData, selectedMetric, settings.rsi.period]);

	// Calculate Moving Averages
	const calculateSMA = useMemo(() => {
		if (!stockData || stockData.length < settings.sma.period) return [];

		const prices = stockData.map(d => d[selectedMetric]);
		const sma = [];

		for (let i = settings.sma.period - 1; i < prices.length; i++) {
			const sum = prices.slice(i - settings.sma.period + 1, i + 1).reduce((a, b) => a + b, 0);
			sma.push(sum / settings.sma.period);
		}

		return sma;
	}, [stockData, selectedMetric, settings.sma.period]);

	const calculateEMA = useMemo(() => {
		if (!stockData || stockData.length < settings.ema.period) return [];

		const prices = stockData.map(d => d[selectedMetric]);
		const ema = [];
		const multiplier = 2 / (settings.ema.period + 1);

		// Initialize EMA with SMA
		let sum = prices.slice(0, settings.ema.period).reduce((a, b) => a + b, 0);
		ema.push(sum / settings.ema.period);

		// Calculate EMA
		for (let i = settings.ema.period; i < prices.length; i++) {
			const currentEMA = (prices[i] * multiplier) + (ema[ema.length - 1] * (1 - multiplier));
			ema.push(currentEMA);
		}

		return ema;
	}, [stockData, selectedMetric, settings.ema.period]);

	// Calculate Bollinger Bands
	const calculateBollingerBands = useMemo(() => {
		if (!stockData || stockData.length < settings.bollinger.period) return { upper: [], middle: [], lower: [] };

		const prices = stockData.map(d => d[selectedMetric]);
		const upper = [];
		const middle = [];
		const lower = [];

		for (let i = settings.bollinger.period - 1; i < prices.length; i++) {
			const slice = prices.slice(i - settings.bollinger.period + 1, i + 1);
			const sma = slice.reduce((a, b) => a + b, 0) / settings.bollinger.period;
			
			const variance = slice.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / settings.bollinger.period;
			const stdDev = Math.sqrt(variance);

			middle.push(sma);
			upper.push(sma + (stdDev * settings.bollinger.stdDev));
			lower.push(sma - (stdDev * settings.bollinger.stdDev));
		}

		return { upper, middle, lower };
	}, [stockData, selectedMetric, settings.bollinger]);

	// Calculate MACD
	const calculateMACD = useMemo(() => {
		if (!stockData || stockData.length < settings.macd.slowPeriod) return { macd: [], signal: [], histogram: [] };

		const prices = stockData.map(d => d[selectedMetric]);
		
		// Calculate fast EMA
		const fastEMA = [];
		const fastMultiplier = 2 / (settings.macd.fastPeriod + 1);
		let fastSum = prices.slice(0, settings.macd.fastPeriod).reduce((a, b) => a + b, 0);
		fastEMA.push(fastSum / settings.macd.fastPeriod);
		
		for (let i = settings.macd.fastPeriod; i < prices.length; i++) {
			const currentEMA = (prices[i] * fastMultiplier) + (fastEMA[fastEMA.length - 1] * (1 - fastMultiplier));
			fastEMA.push(currentEMA);
		}

		// Calculate slow EMA
		const slowEMA = [];
		const slowMultiplier = 2 / (settings.macd.slowPeriod + 1);
		let slowSum = prices.slice(0, settings.macd.slowPeriod).reduce((a, b) => a + b, 0);
		slowEMA.push(slowSum / settings.macd.slowPeriod);
		
		for (let i = settings.macd.slowPeriod; i < prices.length; i++) {
			const currentEMA = (prices[i] * slowMultiplier) + (slowEMA[slowEMA.length - 1] * (1 - slowMultiplier));
			slowEMA.push(currentEMA);
		}

		// Calculate MACD line
		const macdLine = [];
		const startIndex = Math.max(settings.macd.fastPeriod, settings.macd.slowPeriod);
		for (let i = 0; i < Math.min(fastEMA.length, slowEMA.length); i++) {
			macdLine.push(fastEMA[i] - slowEMA[i]);
		}

		// Calculate signal line
		const signalLine = [];
		const signalMultiplier = 2 / (settings.macd.signalPeriod + 1);
		let signalSum = macdLine.slice(0, settings.macd.signalPeriod).reduce((a, b) => a + b, 0);
		signalLine.push(signalSum / settings.macd.signalPeriod);
		
		for (let i = settings.macd.signalPeriod; i < macdLine.length; i++) {
			const currentSignal = (macdLine[i] * signalMultiplier) + (signalLine[signalLine.length - 1] * (1 - signalMultiplier));
			signalLine.push(currentSignal);
		}

		// Calculate histogram
		const histogram = [];
		for (let i = 0; i < Math.min(macdLine.length, signalLine.length); i++) {
			histogram.push(macdLine[i] - signalLine[i]);
		}

		return { macd: macdLine, signal: signalLine, histogram };
	}, [stockData, selectedMetric, settings.macd]);

	// Get current indicator value and status
	const getCurrentIndicatorValue = () => {
		switch (selectedIndicator) {
			case 'rsi':
				const currentRSI = calculateRSI[calculateRSI.length - 1];
				if (!currentRSI) return { value: null, status: 'neutral' };
				if (currentRSI > settings.rsi.overbought) return { value: currentRSI, status: 'overbought' };
				if (currentRSI < settings.rsi.oversold) return { value: currentRSI, status: 'oversold' };
				return { value: currentRSI, status: 'neutral' };
			case 'macd':
				const currentMACD = calculateMACD.macd[calculateMACD.macd.length - 1];
				const currentSignal = calculateMACD.signal[calculateMACD.signal.length - 1];
				if (!currentMACD || !currentSignal) return { value: null, status: 'neutral' };
				return { 
					value: currentMACD, 
					signal: currentSignal,
					status: currentMACD > currentSignal ? 'bullish' : 'bearish' 
				};
			default:
				return { value: null, status: 'neutral' };
		}
	};

	const currentIndicator = getCurrentIndicatorValue();

	// Chart data based on selected indicator
	const getChartData = () => {
		const labels = stockData.map((entry) =>
			new Date(entry.date).toLocaleDateString("en-US", {
				day: "2-digit",
				month: "short",
			})
		);

		const getChartColors = () => {
			if (isDarkMode) {
				return {
					primary: "rgb(192, 132, 252)", // --primary-400
					secondary: "rgb(168, 85, 247)", // --primary-500
					accent: "rgb(147, 51, 234)", // --primary-600
					success: "rgb(34, 197, 94)", // green-500
					danger: "rgb(239, 68, 68)", // red-500
					warning: "rgb(245, 158, 11)", // amber-500
				};
			}
			return {
				primary: "rgb(168, 85, 247)", // --primary-500
				secondary: "rgb(147, 51, 234)", // --primary-600
				accent: "rgb(126, 34, 206)", // --primary-700
				success: "rgb(34, 197, 94)", // green-500
				danger: "rgb(239, 68, 68)", // red-500
				warning: "rgb(245, 158, 11)", // amber-500
			};
		};

		const colors = getChartColors();

		switch (selectedIndicator) {
			case 'rsi':
				return {
					labels: labels.slice(-calculateRSI.length),
					datasets: [
						{
							label: 'RSI',
							data: calculateRSI,
							borderColor: colors.primary,
							backgroundColor: 'rgba(192, 132, 252, 0.1)',
							tension: 0.4,
							fill: false,
							pointRadius: 0,
							pointHoverRadius: 4,
						},
						{
							label: 'Overbought',
							data: Array(calculateRSI.length).fill(settings.rsi.overbought),
							borderColor: colors.danger,
							backgroundColor: 'transparent',
							borderDash: [5, 5],
							tension: 0,
							fill: false,
							pointRadius: 0,
						},
						{
							label: 'Oversold',
							data: Array(calculateRSI.length).fill(settings.rsi.oversold),
							borderColor: colors.success,
							backgroundColor: 'transparent',
							borderDash: [5, 5],
							tension: 0,
							fill: false,
							pointRadius: 0,
						}
					]
				};

			case 'macd':
				return {
					labels: labels.slice(-calculateMACD.macd.length),
					datasets: [
						{
							label: 'MACD',
							data: calculateMACD.macd,
							borderColor: colors.primary,
							backgroundColor: 'transparent',
							tension: 0.4,
							fill: false,
							pointRadius: 0,
							pointHoverRadius: 4,
						},
						{
							label: 'Signal',
							data: calculateMACD.signal,
							borderColor: colors.accent,
							backgroundColor: 'transparent',
							tension: 0.4,
							fill: false,
							pointRadius: 0,
							pointHoverRadius: 4,
						},
						{
							label: 'Histogram',
							data: calculateMACD.histogram,
							borderColor: 'transparent',
							backgroundColor: calculateMACD.histogram.map(val => 
								val >= 0 ? colors.success : colors.danger
							),
							tension: 0,
							fill: false,
							pointRadius: 0,
							type: 'bar',
						}
					]
				};

			case 'sma':
				return {
					labels: labels.slice(-calculateSMA.length),
					datasets: [
						{
							label: 'Price',
							data: stockData.slice(-calculateSMA.length).map(d => d[selectedMetric]),
							borderColor: colors.primary,
							backgroundColor: 'rgba(192, 132, 252, 0.1)',
							tension: 0.4,
							fill: false,
							pointRadius: 0,
							pointHoverRadius: 4,
						},
						{
							label: `SMA (${settings.sma.period})`,
							data: calculateSMA,
							borderColor: colors.accent,
							backgroundColor: 'transparent',
							tension: 0.4,
							fill: false,
							pointRadius: 0,
							pointHoverRadius: 4,
						}
					]
				};

			case 'ema':
				return {
					labels: labels.slice(-calculateEMA.length),
					datasets: [
						{
							label: 'Price',
							data: stockData.slice(-calculateEMA.length).map(d => d[selectedMetric]),
							borderColor: colors.primary,
							backgroundColor: 'rgba(192, 132, 252, 0.1)',
							tension: 0.4,
							fill: false,
							pointRadius: 0,
							pointHoverRadius: 4,
						},
						{
							label: `EMA (${settings.ema.period})`,
							data: calculateEMA,
							borderColor: colors.accent,
							backgroundColor: 'transparent',
							tension: 0.4,
							fill: false,
							pointRadius: 0,
							pointHoverRadius: 4,
						}
					]
				};

			case 'bollinger':
				return {
					labels: labels.slice(-calculateBollingerBands.upper.length),
					datasets: [
						{
							label: 'Price',
							data: stockData.slice(-calculateBollingerBands.upper.length).map(d => d[selectedMetric]),
							borderColor: colors.primary,
							backgroundColor: 'rgba(192, 132, 252, 0.1)',
							tension: 0.4,
							fill: false,
							pointRadius: 0,
							pointHoverRadius: 4,
						},
						{
							label: 'Upper Band',
							data: calculateBollingerBands.upper,
							borderColor: colors.success,
							backgroundColor: 'transparent',
							tension: 0.4,
							fill: false,
							pointRadius: 0,
							pointHoverRadius: 4,
						},
						{
							label: 'Middle Band (SMA)',
							data: calculateBollingerBands.middle,
							borderColor: colors.accent,
							backgroundColor: 'transparent',
							tension: 0.4,
							fill: false,
							pointRadius: 0,
							pointHoverRadius: 4,
						},
						{
							label: 'Lower Band',
							data: calculateBollingerBands.lower,
							borderColor: colors.danger,
							backgroundColor: 'transparent',
							tension: 0.4,
							fill: false,
							pointRadius: 0,
							pointHoverRadius: 4,
						}
					]
				};

			default:
				return { labels: [], datasets: [] };
		}
	};

	const chartData = getChartData();

	const getChartOptions = () => {
		const axisColor = isDarkMode ? '#a78bfa' : '#7c3aed';
		const gridColor = isDarkMode ? 'rgba(168,85,247,0.08)' : 'rgba(168,85,247,0.08)';
		const labelColor = isDarkMode ? '#f3e8ff' : '#6d28d9';
		const tooltipBg = isDarkMode ? 'rgba(30, 27, 75, 0.98)' : 'rgba(244, 235, 255, 0.98)';
		const tooltipTitle = isDarkMode ? '#f3e8ff' : '#6d28d9';
		const tooltipBody = isDarkMode ? '#e0e7ff' : '#4c1d95';

		return {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: true,
					position: 'top',
					labels: {
						color: labelColor,
						font: { size: 14, weight: 'bold' },
						usePointStyle: true,
					}
				},
				tooltip: {
					mode: 'index',
					intersect: false,
					backgroundColor: tooltipBg,
					titleColor: tooltipTitle,
					bodyColor: tooltipBody,
					borderColor: axisColor,
					borderWidth: 1.5,
					padding: 14,
					cornerRadius: 10,
				},
				title: { display: false },
			},
			layout: { padding: 10 },
			scales: {
				x: {
					grid: { color: gridColor, borderColor: axisColor },
					ticks: {
						font: { size: 13, weight: 'bold' },
						color: axisColor,
						maxRotation: 45,
					},
				},
				y: {
					grid: { color: gridColor, borderColor: axisColor, drawBorder: true },
					ticks: {
						font: { size: 13, weight: 'bold' },
						color: axisColor,
						callback: function (value) {
							if (selectedIndicator === 'rsi') {
								return value.toFixed(0);
							}
							return "$" + value.toFixed(2);
						},
					},
				},
			},
			interaction: { intersect: false, mode: 'index' },
			elements: { line: { borderWidth: 3 } },
		};
	};

	const indicators = [
		{ id: 'rsi', name: 'RSI', icon: Activity, description: 'Relative Strength Index' },
		{ id: 'macd', name: 'MACD', icon: BarChart3, description: 'Moving Average Convergence Divergence' },
		{ id: 'sma', name: 'SMA', icon: TrendingUp, description: 'Simple Moving Average' },
		{ id: 'ema', name: 'EMA', icon: TrendingUp, description: 'Exponential Moving Average' },
		{ id: 'bollinger', name: 'Bollinger Bands', icon: Target, description: 'Bollinger Bands' },
	];

	const getStatusIcon = (status) => {
		switch (status) {
			case 'overbought':
			case 'bearish':
				return <AlertTriangle className="w-4 h-4 text-red-500" />;
			case 'oversold':
			case 'bullish':
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			default:
				return <Info className="w-4 h-4 text-blue-500" />;
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'overbought':
			case 'bearish':
				return 'text-red-600 dark:text-red-400';
			case 'oversold':
			case 'bullish':
				return 'text-green-600 dark:text-green-400';
			default:
				return 'text-blue-600 dark:text-blue-400';
		}
	};

	if (!stockData || stockData.length === 0) {
		return (
			<Card className="bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm border-[var(--background-200)] dark:border-[var(--background-300)] shadow-xl">
				<CardHeader>
					<CardTitle className="text-[var(--text-900)] dark:text-[var(--text-50)]">
						Technical Indicators
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-12">
						<BarChart3 className="w-12 h-12 text-[var(--text-400)] dark:text-[var(--text-500)] mx-auto mb-4" />
						<p className="text-[var(--text-600)] dark:text-[var(--text-400)]">
							No data available for technical analysis
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm border-[var(--background-200)] dark:border-[var(--background-300)] shadow-xl">
			<CardHeader>
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-lg flex items-center justify-center">
							<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
						</div>
						<div>
							<CardTitle className="text-lg sm:text-xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
								Technical Indicators
							</CardTitle>
							<p className="text-xs sm:text-sm text-[var(--text-600)] dark:text-[var(--text-400)] mt-1">
								Advanced technical analysis tools
							</p>
						</div>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setShowSettings(!showSettings)}
						className="hover:bg-[var(--primary-100)] dark:hover:bg-[var(--primary-800)] text-[var(--text-700)] dark:text-[var(--text-300)] border-[var(--primary-300)] dark:border-[var(--primary-600)]"
					>
						<Settings className="w-4 h-4 mr-2" />
						Settings
					</Button>
				</div>

				{/* Indicator Selector */}
				<div className="flex flex-wrap gap-2 mt-4">
					{indicators.map((indicator) => (
						<Button
							key={indicator.id}
							variant={selectedIndicator === indicator.id ? "default" : "outline"}
							size="sm"
							onClick={() => setSelectedIndicator(indicator.id)}
							className={cn(
								"text-xs font-medium transition-all duration-200",
								selectedIndicator === indicator.id
									? "bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white"
									: "hover:bg-[var(--background-200)] dark:hover:bg-[var(--background-300)] text-[var(--text-700)] dark:text-[var(--text-300)] border-[var(--background-300)] dark:border-[var(--background-400)]"
							)}
						>
							<indicator.icon className="w-3 h-3 mr-1" />
							{indicator.name}
						</Button>
					))}
				</div>

				{/* Current Indicator Status */}
				{currentIndicator.value !== null && (
					<div className="flex items-center gap-3 mt-4 p-3 bg-[var(--background-200)] dark:bg-[var(--background-300)] rounded-lg">
						{getStatusIcon(currentIndicator.status)}
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium text-[var(--text-700)] dark:text-[var(--text-300)]">
									Current {indicators.find(i => i.id === selectedIndicator)?.name}:
								</span>
								<span className={cn("text-sm font-bold", getStatusColor(currentIndicator.status))}>
									{currentIndicator.value?.toFixed(2)}
									{selectedIndicator === 'macd' && currentIndicator.signal && (
										<span className="ml-2 text-[var(--text-600)] dark:text-[var(--text-400)]">
											(Signal: {currentIndicator.signal.toFixed(2)})
										</span>
									)}
								</span>
							</div>
							<div className="flex items-center gap-2 mt-1">
								<Badge 
									variant="outline" 
									className={cn(
										"text-xs",
										currentIndicator.status === 'bullish' || currentIndicator.status === 'oversold'
											? "border-green-500 text-green-600 dark:text-green-400"
											: currentIndicator.status === 'bearish' || currentIndicator.status === 'overbought'
											? "border-red-500 text-red-600 dark:text-red-400"
											: "border-blue-500 text-blue-600 dark:text-blue-400"
									)}
								>
									{currentIndicator.status.charAt(0).toUpperCase() + currentIndicator.status.slice(1)}
								</Badge>
								<span className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)]">
									{indicators.find(i => i.id === selectedIndicator)?.description}
								</span>
							</div>
						</div>
					</div>
				)}
			</CardHeader>

			<CardContent>
				{/* Settings Panel */}
				{showSettings && (
					<div className="mb-6 p-4 bg-[var(--background-200)] dark:bg-[var(--background-300)] rounded-lg border border-[var(--background-300)] dark:border-[var(--background-400)]">
						<h4 className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)] mb-3">
							Indicator Settings
						</h4>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{selectedIndicator === 'rsi' && (
								<>
									<div>
										<label className="text-xs text-[var(--text-600)] dark:text-[var(--text-400)]">Period</label>
										<input
											type="number"
											value={settings.rsi.period}
											onChange={(e) => setSettings(prev => ({
												...prev,
												rsi: { ...prev.rsi, period: parseInt(e.target.value) || 14 }
											}))}
											className="w-full mt-1 px-3 py-2 text-sm bg-[var(--background-100)] dark:bg-[var(--background-200)] border border-[var(--background-300)] dark:border-[var(--background-400)] rounded-md text-[var(--text-900)] dark:text-[var(--text-50)]"
										/>
									</div>
									<div>
										<label className="text-xs text-[var(--text-600)] dark:text-[var(--text-400)]">Overbought</label>
										<input
											type="number"
											value={settings.rsi.overbought}
											onChange={(e) => setSettings(prev => ({
												...prev,
												rsi: { ...prev.rsi, overbought: parseInt(e.target.value) || 70 }
											}))}
											className="w-full mt-1 px-3 py-2 text-sm bg-[var(--background-100)] dark:bg-[var(--background-200)] border border-[var(--background-300)] dark:border-[var(--background-400)] rounded-md text-[var(--text-900)] dark:text-[var(--text-50)]"
										/>
									</div>
									<div>
										<label className="text-xs text-[var(--text-600)] dark:text-[var(--text-400)]">Oversold</label>
										<input
											type="number"
											value={settings.rsi.oversold}
											onChange={(e) => setSettings(prev => ({
												...prev,
												rsi: { ...prev.rsi, oversold: parseInt(e.target.value) || 30 }
											}))}
											className="w-full mt-1 px-3 py-2 text-sm bg-[var(--background-100)] dark:bg-[var(--background-200)] border border-[var(--background-300)] dark:border-[var(--background-400)] rounded-md text-[var(--text-900)] dark:text-[var(--text-50)]"
										/>
									</div>
								</>
							)}
							{selectedIndicator === 'macd' && (
								<>
									<div>
										<label className="text-xs text-[var(--text-600)] dark:text-[var(--text-400)]">Fast Period</label>
										<input
											type="number"
											value={settings.macd.fastPeriod}
											onChange={(e) => setSettings(prev => ({
												...prev,
												macd: { ...prev.macd, fastPeriod: parseInt(e.target.value) || 12 }
											}))}
											className="w-full mt-1 px-3 py-2 text-sm bg-[var(--background-100)] dark:bg-[var(--background-200)] border border-[var(--background-300)] dark:border-[var(--background-400)] rounded-md text-[var(--text-900)] dark:text-[var(--text-50)]"
										/>
									</div>
									<div>
										<label className="text-xs text-[var(--text-600)] dark:text-[var(--text-400)]">Slow Period</label>
										<input
											type="number"
											value={settings.macd.slowPeriod}
											onChange={(e) => setSettings(prev => ({
												...prev,
												macd: { ...prev.macd, slowPeriod: parseInt(e.target.value) || 26 }
											}))}
											className="w-full mt-1 px-3 py-2 text-sm bg-[var(--background-100)] dark:bg-[var(--background-200)] border border-[var(--background-300)] dark:border-[var(--background-400)] rounded-md text-[var(--text-900)] dark:text-[var(--text-50)]"
										/>
									</div>
									<div>
										<label className="text-xs text-[var(--text-600)] dark:text-[var(--text-400)]">Signal Period</label>
										<input
											type="number"
											value={settings.macd.signalPeriod}
											onChange={(e) => setSettings(prev => ({
												...prev,
												macd: { ...prev.macd, signalPeriod: parseInt(e.target.value) || 9 }
											}))}
											className="w-full mt-1 px-3 py-2 text-sm bg-[var(--background-100)] dark:bg-[var(--background-200)] border border-[var(--background-300)] dark:border-[var(--background-400)] rounded-md text-[var(--text-900)] dark:text-[var(--text-50)]"
										/>
									</div>
								</>
							)}
							{(selectedIndicator === 'sma' || selectedIndicator === 'ema') && (
								<div>
									<label className="text-xs text-[var(--text-600)] dark:text-[var(--text-400)]">Period</label>
									<input
										type="number"
										value={selectedIndicator === 'sma' ? settings.sma.period : settings.ema.period}
										onChange={(e) => setSettings(prev => ({
											...prev,
											[selectedIndicator]: { ...prev[selectedIndicator], period: parseInt(e.target.value) || 20 }
										}))}
										className="w-full mt-1 px-3 py-2 text-sm bg-[var(--background-100)] dark:bg-[var(--background-200)] border border-[var(--background-300)] dark:border-[var(--background-400)] rounded-md text-[var(--text-900)] dark:text-[var(--text-50)]"
									/>
								</div>
							)}
							{selectedIndicator === 'bollinger' && (
								<>
									<div>
										<label className="text-xs text-[var(--text-600)] dark:text-[var(--text-400)]">Period</label>
										<input
											type="number"
											value={settings.bollinger.period}
											onChange={(e) => setSettings(prev => ({
												...prev,
												bollinger: { ...prev.bollinger, period: parseInt(e.target.value) || 20 }
											}))}
											className="w-full mt-1 px-3 py-2 text-sm bg-[var(--background-100)] dark:bg-[var(--background-200)] border border-[var(--background-300)] dark:border-[var(--background-400)] rounded-md text-[var(--text-900)] dark:text-[var(--text-50)]"
										/>
									</div>
									<div>
										<label className="text-xs text-[var(--text-600)] dark:text-[var(--text-400)]">Standard Deviation</label>
										<input
											type="number"
											step="0.1"
											value={settings.bollinger.stdDev}
											onChange={(e) => setSettings(prev => ({
												...prev,
												bollinger: { ...prev.bollinger, stdDev: parseFloat(e.target.value) || 2 }
											}))}
											className="w-full mt-1 px-3 py-2 text-sm bg-[var(--background-100)] dark:bg-[var(--background-200)] border border-[var(--background-300)] dark:border-[var(--background-400)] rounded-md text-[var(--text-900)] dark:text-[var(--text-50)]"
										/>
									</div>
								</>
							)}
						</div>
					</div>
				)}

				{/* Chart */}
				<div className="h-[300px] sm:h-[400px] transition-all duration-300">
					{selectedIndicator === 'macd' ? (
						<Bar data={chartData} options={getChartOptions()} ref={chartRef} />
					) : (
						<Line data={chartData} options={getChartOptions()} ref={chartRef} />
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default TechnicalIndicators;