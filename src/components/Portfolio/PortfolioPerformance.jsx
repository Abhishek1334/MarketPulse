import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	Filler
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
	TrendingUp, 
	TrendingDown, 
	DollarSign, 
	BarChart3, 
	PieChart,
	Plus,
	Edit,
	Trash2,
	Activity,
	Calendar,
	Eye,
	EyeOff,
	Target,
	Zap,
	ArrowUpRight,
	ArrowDownRight,
	Percent,
	Coins,
	Wallet,
	ChartBar,
	Sparkles,
	Star,
	Trophy,
	TrendingUpIcon,
	TrendingDownIcon,
	AlertTriangle
} from 'lucide-react';
import useStore from '@/context/Store';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

// Register Chart.js elements
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

const SECTORS = [
	'Technology',
	'Finance',
	'Healthcare',
	'Energy',
	'Consumer Discretionary',
	'Consumer Staples',
	'Industrials',
	'Materials',
	'Utilities',
	'Real Estate',
	'Communication Services',
	'Other'
];

const PortfolioPerformance = () => {
	const {
		portfolio,
		addHolding,
		removeHolding,
		calculatePortfolioMetrics,
		getPortfolioAnalytics
	} = useStore();

	const [isDarkMode, setIsDarkMode] = useState(false);
	const [showAddHolding, setShowAddHolding] = useState(false);
	const [showUnrealizedGains, setShowUnrealizedGains] = useState(true);
	const [holdingForm, setHoldingForm] = useState({
		symbol: '',
		shares: '',
		averagePrice: '',
		notes: '',
		sector: SECTORS[0],
	});
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [holdingToDelete, setHoldingToDelete] = useState(null);

	const performanceChartRef = useRef(null);
	const sectorChartRef = useRef(null);

	// Cleanup charts on unmount
	useEffect(() => {
		return () => {
			if (performanceChartRef.current) {
				performanceChartRef.current.destroy();
			}
			if (sectorChartRef.current) {
				sectorChartRef.current.destroy();
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

	// Calculate metrics on component mount and when portfolio changes
	useEffect(() => {
		calculatePortfolioMetrics();
	}, [portfolio.holdings]);

	// Get analytics
	const analytics = useMemo(() => getPortfolioAnalytics(), [portfolio]);

	const perfHistory = analytics.performanceHistory;
	const perfLabels = perfHistory.map(item => new Date(item.date).toLocaleDateString());
	const perfValues = perfHistory.map(item => item.value);

	// Chart colors
	const getChartColors = () => {
		if (isDarkMode) {
			return {
				primary: "rgb(192, 132, 252)",
				secondary: "rgb(168, 85, 247)",
				success: "rgb(34, 197, 94)",
				danger: "rgb(239, 68, 68)",
			};
		}
		return {
			primary: "rgb(168, 85, 247)",
			secondary: "rgb(147, 51, 234)",
			success: "rgb(34, 197, 94)",
			danger: "rgb(239, 68, 68)",
		};
	};

	const colors = getChartColors();

	// Calculate moving average for trendline
	const movingAverage = (data, period = 5) => {
		if (!data || data.length < period) return [];
		const ma = [];
		for (let i = 0; i < data.length; i++) {
			if (i < period - 1) {
				ma.push(null);
			} else {
				const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
				ma.push(sum / period);
			}
		}
		return ma;
	};

	const perfMA = movingAverage(perfValues, 5);
	const latestValue = perfValues[perfValues.length - 1] || 0;
	const prevValue = perfValues[perfValues.length - 2] || latestValue;
	const pctChange = prevValue !== 0 ? ((latestValue - prevValue) / prevValue) * 100 : 0;

	// Performance chart data
	const performanceChartData = {
		labels: perfLabels,
		datasets: [
			{
				label: 'Portfolio Value',
				data: perfValues,
				borderColor: colors.primary,
				backgroundColor: (ctx) => {
					const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 350);
					gradient.addColorStop(0, isDarkMode ? 'rgba(192,132,252,0.25)' : 'rgba(168,85,247,0.25)');
					gradient.addColorStop(1, isDarkMode ? 'rgba(30,27,75,0.01)' : 'rgba(255,255,255,0.01)');
					return gradient;
				},
				tension: 0.4,
				fill: true,
				pointRadius: perfValues.map((_, i) => i === perfValues.length - 1 ? 6 : 3),
				pointBackgroundColor: perfValues.map((_, i) => i === perfValues.length - 1 ? (pctChange >= 0 ? colors.success : colors.danger) : colors.primary),
				pointBorderWidth: perfValues.map((_, i) => i === perfValues.length - 1 ? 3 : 1),
				pointBorderColor: perfValues.map((_, i) => i === perfValues.length - 1 ? (isDarkMode ? '#18181b' : '#fff') : (isDarkMode ? '#18181b' : '#fff')),
				pointHoverRadius: 8,
				order: 1,
			},
			{
				label: '5-Day Moving Avg',
				data: perfMA,
				borderColor: colors.secondary,
				borderDash: [6, 6],
				borderWidth: 2,
				pointRadius: 0,
				fill: false,
				order: 2,
			}
		]
	};

	// Sector allocation chart data
	const sectorChartData = {
		labels: Object.keys(analytics.sectorAllocation),
		datasets: [
			{
				data: Object.values(analytics.sectorAllocation),
				backgroundColor: [
					colors.primary,
					colors.secondary,
					colors.success,
					colors.danger,
				],
				borderWidth: 2,
				borderColor: isDarkMode ? '#1e2128' : '#ffffff',
			}
		]
	};

	// Chart options
	const getChartOptions = (type = 'line') => {
		const axisColor = isDarkMode ? '#a78bfa' : '#7c3aed';
		const gridColor = isDarkMode ? 'rgba(168,85,247,0.08)' : 'rgba(168,85,247,0.08)';
		const labelColor = isDarkMode ? '#f3e8ff' : '#6d28d9';
		const tooltipBg = isDarkMode ? 'rgba(30, 27, 75, 0.98)' : 'rgba(244, 235, 255, 0.98)';
		const tooltipTitle = isDarkMode ? '#f3e8ff' : '#6d28d9';
		const tooltipBody = isDarkMode ? '#e0e7ff' : '#4c1d95';

		const baseOptions = {
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
					backgroundColor: tooltipBg,
					titleColor: tooltipTitle,
					bodyColor: tooltipBody,
					borderColor: axisColor,
					borderWidth: 1.5,
					padding: 14,
					cornerRadius: 10,
					callbacks: {
						title: (ctx) => ctx[0].label,
						label: (ctx) => {
							const idx = ctx.dataIndex;
							const value = ctx.dataset.data[idx];
							if (ctx.dataset.label === 'Portfolio Value') {
								let change = '';
								if (idx > 0) {
									const prev = ctx.dataset.data[idx - 1];
									const pct = prev !== 0 ? ((value - prev) / prev) * 100 : 0;
									change = ` (${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%)`;
								}
								return `Value: $${value.toLocaleString()}${change}`;
							}
							if (ctx.dataset.label === '5-Day Moving Avg') {
								return `5d MA: $${value ? value.toLocaleString(undefined, {maximumFractionDigits: 2}) : '-'} `;
							}
							return `${ctx.dataset.label}: $${value.toLocaleString()}`;
						}
					}
				},
				title: { display: false },
			},
			layout: { padding: 10 },
		};

		if (type === 'line') {
			return {
				...baseOptions,
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
							callback: (value) => "$" + value.toLocaleString(),
						},
					},
				},
				interaction: { intersect: false, mode: 'index' },
				elements: { line: { borderWidth: 3 } },
			};
		}
		return baseOptions;
	};

	// Handle form submission
	const handleAddHolding = (e) => {
		e.preventDefault();
		
		if (!holdingForm.symbol || !holdingForm.shares || !holdingForm.averagePrice) {
			showError("Please fill in all required fields");
			return;
		}

		try {
			addHolding({ ...holdingForm });
			showSuccess("Holding added successfully!");
			setHoldingForm({
				symbol: '',
				shares: '',
				averagePrice: '',
				notes: '',
				sector: SECTORS[0],
			});
			setShowAddHolding(false);
		} catch (error) {
			showError("Failed to add holding");
		}
	};

	const calculateHoldingMetrics = (holding) => {
		// Mock calculation - in real app, you'd fetch current price
		const currentPrice = holding.averagePrice * (1 + (Math.random() - 0.5) * 0.2);
		const marketValue = holding.shares * currentPrice;
		const costBasis = holding.shares * holding.averagePrice;
		const gain = marketValue - costBasis;
		const gainPercent = (gain / costBasis) * 100;

		return {
			currentPrice,
			marketValue,
			gain,
			gainPercent
		};
	};

	const getPerformanceStatus = () => {
		const gain = portfolio.performance.totalGain;
		if (gain >= 0) {
			return {
				icon: TrendingUp,
				color: "text-green-600 dark:text-green-400",
				bgColor: "bg-green-100 dark:bg-green-900/20",
				borderColor: "border-green-200 dark:border-green-800"
			};
		}
		return {
			icon: TrendingDown,
			color: "text-red-600 dark:text-red-400",
			bgColor: "bg-red-100 dark:bg-red-900/20",
			borderColor: "border-red-200 dark:border-red-800"
		};
	};

	const performanceStatus = getPerformanceStatus();

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/20 p-4 sm:p-6 lg:p-8 space-y-8">
			{/* Hero Section */}
			<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-8 text-white shadow-2xl">
				<div className="absolute inset-0 bg-black/10"></div>
				<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
				<div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
				
				<div className="relative z-10">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
							<Wallet className="w-6 h-6" />
						</div>
						<div>
							<h1 className="text-3xl sm:text-4xl font-bold">Portfolio Dashboard</h1>
							<p className="text-purple-100 text-lg">Track your investments and performance</p>
						</div>
					</div>
					
					<div className="flex flex-wrap items-center gap-4 mt-6">
						<div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
							<Sparkles className="w-4 h-4" />
							<span className="text-sm font-medium">Total Value</span>
						</div>
						<div className="text-2xl sm:text-3xl font-bold">
							${portfolio.performance.totalValue.toLocaleString()}
						</div>
						<div className={cn(
							"flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
							portfolio.performance.totalGain >= 0 
								? "bg-green-500/20 text-green-100" 
								: "bg-red-500/20 text-red-100"
						)}>
							{portfolio.performance.totalGain >= 0 ? (
								<ArrowUpRight className="w-4 h-4" />
							) : (
								<ArrowDownRight className="w-4 h-4" />
							)}
							{portfolio.performance.totalGainPercent.toFixed(2)}%
						</div>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Portfolio Overview</h2>
					<Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
						{portfolio.holdings.length} Holdings
					</Badge>
				</div>
				<Button
					onClick={() => setShowAddHolding(true)}
					className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
				>
					<Plus className="w-4 h-4 mr-2" />
					Add Holding
				</Button>
			</div>

			{/* Performance Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{/* Total Value Card */}
				<Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
					<div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -translate-y-10 translate-x-10"></div>
					<CardHeader className="pb-3 relative z-10">
						<div className="flex items-center justify-between">
							<CardTitle className="text-emerald-800 dark:text-emerald-200 text-lg font-semibold">
								Total Value
							</CardTitle>
							<div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
								<DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
							</div>
						</div>
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
							${portfolio.performance.totalValue.toLocaleString()}
						</div>
						<div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
							<TrendingUpIcon className="w-4 h-4" />
							<span>Current portfolio value</span>
						</div>
					</CardContent>
				</Card>

				{/* Total Cost Card */}
				<Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
					<div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
					<CardHeader className="pb-3 relative z-10">
						<div className="flex items-center justify-between">
							<CardTitle className="text-blue-800 dark:text-blue-200 text-lg font-semibold">
								Total Cost
							</CardTitle>
							<div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
								<Coins className="h-5 w-5 text-blue-600 dark:text-blue-400" />
							</div>
						</div>
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">
							${portfolio.performance.totalCost.toLocaleString()}
						</div>
						<div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm">
							<Target className="w-4 h-4" />
							<span>Total amount invested</span>
						</div>
					</CardContent>
				</Card>

				{/* Total Gain/Loss Card */}
				<Card className={cn(
					"group relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1",
					portfolio.performance.totalGain >= 0 
						? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
						: "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800"
				)}>
					<div className={cn(
						"absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-10 translate-x-10",
						portfolio.performance.totalGain >= 0 
							? "bg-green-500/10" 
							: "bg-red-500/10"
					)}></div>
					<CardHeader className="pb-3 relative z-10">
						<div className="flex items-center justify-between">
							<CardTitle className={cn(
								"text-lg font-semibold",
								portfolio.performance.totalGain >= 0 
									? "text-green-800 dark:text-green-200"
									: "text-red-800 dark:text-red-200"
							)}>
								Total Gain/Loss
							</CardTitle>
							<div className={cn(
								"w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300",
								portfolio.performance.totalGain >= 0 
									? "bg-green-500/20" 
									: "bg-red-500/20"
							)}>
								<performanceStatus.icon className={cn("h-5 w-5", performanceStatus.color)} />
							</div>
						</div>
					</CardHeader>
					<CardContent className="relative z-10">
						<div className={cn(
							"text-3xl font-bold mb-2",
							portfolio.performance.totalGain >= 0 
								? "text-green-700 dark:text-green-300"
								: "text-red-700 dark:text-red-300"
						)}>
							${portfolio.performance.totalGain.toLocaleString()}
						</div>
						<div className={cn(
							"flex items-center gap-2 text-sm",
							portfolio.performance.totalGain >= 0 
								? "text-green-600 dark:text-green-400"
								: "text-red-600 dark:text-red-400"
						)}>
							<Percent className="w-4 h-4" />
							<span>{portfolio.performance.totalGainPercent.toFixed(2)}% return</span>
						</div>
					</CardContent>
				</Card>

				{/* Holdings Count Card */}
				<Card className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
					<div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
					<CardHeader className="pb-3 relative z-10">
						<div className="flex items-center justify-between">
							<CardTitle className="text-purple-800 dark:text-purple-200 text-lg font-semibold">
								Holdings
							</CardTitle>
							<div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
								<ChartBar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
							</div>
						</div>
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-2">
							{portfolio.holdings.length}
						</div>
						<div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm">
							<Star className="w-4 h-4" />
							<span>Active positions</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Performance Chart */}
				<Card className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
					<CardHeader className="pb-4">
						<div className="flex items-center justify-between">
							<CardTitle className="text-slate-900 dark:text-slate-50 flex items-center gap-3">
								<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
									<TrendingUp className="h-5 w-5 text-white" />
								</div>
								<div>
									<div className="text-lg font-bold">Performance History</div>
									<div className="text-sm text-slate-600 dark:text-slate-400">Portfolio value over time</div>
								</div>
							</CardTitle>
							<Trophy className="w-5 h-5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-3 mb-2">
							<span className={cn(
								"inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm shadow-sm",
								pctChange >= 0
									? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
									: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
							)}>
								{pctChange >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
								${latestValue.toLocaleString()} ({pctChange >= 0 ? '+' : ''}{pctChange.toFixed(2)}%)
							</span>
							<span className="text-xs text-slate-500 dark:text-slate-400">Latest Value</span>
						</div>
						<div className="h-[320px]">
							<Line data={performanceChartData} options={getChartOptions('line')} ref={performanceChartRef} />
						</div>
					</CardContent>
				</Card>

				{/* Sector Allocation */}
				<Card className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
					<CardHeader className="pb-4">
						<div className="flex items-center justify-between">
							<CardTitle className="text-slate-900 dark:text-slate-50 flex items-center gap-3">
								<div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
									<PieChart className="h-5 w-5 text-white" />
								</div>
								<div>
									<div className="text-lg font-bold">Sector Allocation</div>
									<div className="text-sm text-slate-600 dark:text-slate-400">Portfolio diversification</div>
								</div>
							</CardTitle>
							<Zap className="w-5 h-5 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="h-[350px]">
							<Doughnut data={sectorChartData} options={getChartOptions('doughnut')} ref={sectorChartRef} />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Holdings Table */}
			<Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
				<CardHeader className="pb-4">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
								<Activity className="h-5 w-5 text-white" />
							</div>
							<div>
								<CardTitle className="text-slate-900 dark:text-slate-50 text-lg font-bold">
									Current Holdings
								</CardTitle>
								<div className="text-sm text-slate-600 dark:text-slate-400">
									Manage your investment positions
								</div>
							</div>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowUnrealizedGains(!showUnrealizedGains)}
							className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all duration-300"
						>
							{showUnrealizedGains ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
							{showUnrealizedGains ? 'Hide' : 'Show'} Gains
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{portfolio.holdings.length === 0 ? (
						<div className="text-center py-16">
							<div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
								<BarChart3 className="w-10 h-10 text-purple-600 dark:text-purple-400" />
							</div>
							<h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
								No holdings yet
							</h3>
							<p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
								Start building your portfolio by adding your first investment. Track your performance and watch your wealth grow.
							</p>
							<Button
								onClick={() => setShowAddHolding(true)}
								className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
							>
								<Plus className="w-4 h-4 mr-2" />
								Add Your First Holding
							</Button>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-slate-200 dark:border-slate-700">
										<th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
											Symbol
										</th>
										<th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
											Shares
										</th>
										<th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
											Avg Price
										</th>
										<th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
											Market Value
										</th>
										{showUnrealizedGains && (
											<th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
												Gain/Loss
											</th>
										)}
										<th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{portfolio.holdings.map((holding, index) => {
										const metrics = calculateHoldingMetrics(holding);
										return (
											<tr key={holding.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200">
												<td className="py-4 px-4">
													<div className="flex items-center gap-3">
														<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
															{holding.symbol.charAt(0)}
														</div>
														<div>
															<div className="font-semibold text-slate-900 dark:text-slate-50">
																{holding.symbol}
															</div>
															{holding.notes && (
																<div className="text-xs text-slate-600 dark:text-slate-400">
																	{holding.notes}
																</div>
															)}
														</div>
													</div>
												</td>
												<td className="py-4 px-4 text-slate-900 dark:text-slate-50 font-medium">
													{holding.shares.toLocaleString()}
												</td>
												<td className="py-4 px-4 text-slate-900 dark:text-slate-50 font-medium">
													${holding.averagePrice.toFixed(2)}
												</td>
												<td className="py-4 px-4 text-slate-900 dark:text-slate-50 font-medium">
													${metrics.marketValue.toLocaleString()}
												</td>
												{showUnrealizedGains && (
													<td className="py-4 px-4">
														<div className={`font-semibold ${
															metrics.gain >= 0 
																? 'text-green-600 dark:text-green-400' 
																: 'text-red-600 dark:text-red-400'
														}`}>
															${metrics.gain.toLocaleString()}
														</div>
														<div className={`text-xs ${
															metrics.gain >= 0 
																? 'text-green-500 dark:text-green-400' 
																: 'text-red-500 dark:text-red-400'
														}`}>
															{metrics.gainPercent.toFixed(2)}%
														</div>
													</td>
												)}
												<td className="py-4 px-4">
													<Button
														variant="ghost"
														size="sm"
														onClick={() => {
															setHoldingToDelete(holding);
															setShowDeleteModal(true);
														}}
														className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:scale-110 transition-transform duration-200"
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Add Holding Modal */}
			{showAddHolding && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<Card className="w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
									<Plus className="h-5 w-5 text-white" />
								</div>
								<div>
									<CardTitle className="text-slate-900 dark:text-slate-50 text-lg font-bold">
										Add New Holding
									</CardTitle>
									<div className="text-sm text-slate-600 dark:text-slate-400">
										Track your investment position
									</div>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleAddHolding} className="space-y-4">
								<div>
									<Label htmlFor="symbol" className="text-slate-700 dark:text-slate-300">Symbol</Label>
									<Input
										id="symbol"
										value={holdingForm.symbol}
										onChange={(e) => setHoldingForm({ ...holdingForm, symbol: e.target.value.toUpperCase() })}
										placeholder="AAPL"
										required
										className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400"
									/>
								</div>
								<div>
									<Label htmlFor="shares" className="text-slate-700 dark:text-slate-300">Shares</Label>
									<Input
										id="shares"
										type="number"
										step="0.01"
										value={holdingForm.shares}
										onChange={(e) => setHoldingForm({ ...holdingForm, shares: e.target.value })}
										placeholder="100"
										required
										className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400"
									/>
								</div>
								<div>
									<Label htmlFor="averagePrice" className="text-slate-700 dark:text-slate-300">Average Price</Label>
									<Input
										id="averagePrice"
										type="number"
										step="0.01"
										value={holdingForm.averagePrice}
										onChange={(e) => setHoldingForm({ ...holdingForm, averagePrice: e.target.value })}
										placeholder="150.00"
										required
										className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400"
									/>
								</div>
								<div>
									<Label htmlFor="notes" className="text-slate-700 dark:text-slate-300">Notes (Optional)</Label>
									<Input
										id="notes"
										value={holdingForm.notes}
										onChange={(e) => setHoldingForm({ ...holdingForm, notes: e.target.value })}
										placeholder="Add notes about this investment..."
										className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400"
									/>
								</div>
								<div>
									<Label htmlFor="sector" className="text-slate-700 dark:text-slate-300">Sector</Label>
									<select
										id="sector"
										value={holdingForm.sector}
										onChange={e => setHoldingForm({ ...holdingForm, sector: e.target.value })}
										className="w-full mt-1 px-3 py-2 bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 rounded-md text-[var(--text-900)] dark:text-[var(--text-50)]"
										required
									>
										{SECTORS.map(sector => (
											<option key={sector} value={sector}>{sector}</option>
										))}
									</select>
								</div>
								<div className="flex gap-3 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={() => setShowAddHolding(false)}
										className="flex-1 bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
									>
										Cancel
									</Button>
									<Button 
										type="submit" 
										className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
									>
										Add Holding
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{showDeleteModal && holdingToDelete && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<Card className="w-full max-w-sm bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700 shadow-2xl">
						<CardHeader className="pb-4 flex flex-col items-center">
							<AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
							<CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-1">
								Delete Holding
							</CardTitle>
							<div className="text-sm text-slate-600 dark:text-slate-400 text-center">
								Are you sure you want to delete <span className="font-semibold">{holdingToDelete.symbol}</span> from your portfolio? This action cannot be undone.
							</div>
						</CardHeader>
						<CardContent>
							<div className="flex gap-3 pt-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => setShowDeleteModal(false)}
									className="flex-1 bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
								>
									Cancel
								</Button>
								<Button
									type="button"
									className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
									onClick={() => {
										removeHolding(holdingToDelete.id);
										showSuccess(`${holdingToDelete.symbol} removed from portfolio`);
										setShowDeleteModal(false);
										setHoldingToDelete(null);
									}}
								>
									Delete
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
};

export default PortfolioPerformance; 