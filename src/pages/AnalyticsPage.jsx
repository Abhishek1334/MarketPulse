import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
	ArrowUp,
	ArrowDown,
	Clock,
	Activity,
	TrendingUp,
	DollarSign,
	BarChart2,
	Loader2,
	ArrowLeft,
	Calendar,
	Zap
} from "lucide-react";
import useRateLimitedFetch from "../service/RateLimiting";
import { useAnalyticsStore } from "@/context/AnalyticsStore";
import ChartSection from "../components/Analytics/ChartSection";
import TechnicalIndicators from "../components/Analytics/TechnicalIndicators";
import AddToWatchlistModal from "../components/Analytics/AddToWatchlistModal";
import PriceAlertModal from "../components/Analytics/PriceAlertModal";
import FundamentalsModal from "../components/Analytics/FundamentalsModal";
import { makeCacheKey } from "../service/RateLimiting";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AnalyticsPage = () => {
	const { symbol } = useParams();
	const [processedData, setProcessedData] = useState([]);
	const [error, setError] = useState(null);
	const { addToQueue, results, isFetching } = useRateLimitedFetch();
	const navigate = useNavigate();
	const analyticsRef = useRef(null);

	// Modal states
	const [isAddToWatchlistOpen, setIsAddToWatchlistOpen] = useState(false);
	const [isPriceAlertOpen, setIsPriceAlertOpen] = useState(false);
	const [isFundamentalsOpen, setIsFundamentalsOpen] = useState(false);

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

	// GSAP Animations
	useEffect(() => {
		const ctx = gsap.context(() => {
			// Animate dashboard sections
			gsap.fromTo(".analytics-header", {
				y: -50,
				opacity: 0
			}, {
				y: 0,
				opacity: 1,
				duration: 0.8,
				ease: "power3.out"
			});

			gsap.fromTo(".analytics-stats", {
				y: 30,
				opacity: 0
			}, {
				y: 0,
				opacity: 1,
				duration: 0.8,
				delay: 0.2,
				ease: "power3.out"
			});

			gsap.fromTo(".analytics-chart", {
				y: 50,
				opacity: 0
			}, {
				y: 0,
				opacity: 1,
				duration: 0.8,
				delay: 0.4,
				ease: "power3.out"
			});

		}, analyticsRef);

		return () => ctx.revert();
	}, []);

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
		open: processedData[0]?.open?.toFixed(2),
		close: processedData[0]?.close?.toFixed(2),
		high: processedData[0]?.high?.toFixed(2),
		low: processedData[0]?.low?.toFixed(2),
		volume: processedData[0]?.volume?.toLocaleString(),
	};

	// Quick action handlers
	const handleAddToWatchlist = () => {
		setIsAddToWatchlistOpen(true);
	};

	const handleSetPriceAlert = () => {
		setIsPriceAlertOpen(true);
	};

	const handleViewFundamentals = () => {
		setIsFundamentalsOpen(true);
	};

	return (
		<div ref={analyticsRef} className="min-h-screen bg-gradient-to-br from-[var(--background-50)] to-[var(--background-100)] dark:from-[var(--background-50)] dark:to-[var(--background-100)] p-4 md:p-6 lg:p-8 transition-all duration-300">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header Section */}
				<div className="analytics-header">
					<Card className="bg-gradient-to-r from-[var(--background-100)] to-[var(--background-200)] dark:from-[var(--background-200)] dark:to-[var(--background-300)] border-[var(--background-300)] dark:border-[var(--background-400)] shadow-xl transition-all duration-300">
						<CardContent className="p-6">
							<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
								{/* Left Side - Stock Info */}
								<div className="flex-1">
									<div className="flex items-center gap-4 mb-4">
										<Button
											onClick={() => navigate(-1)}
											variant="ghost"
											size="icon"
											className="hover:bg-[var(--background-300)] dark:hover:bg-[var(--background-400)] transition-colors duration-200"
										>
											<ArrowLeft className="h-5 w-5 text-[var(--text-900)] dark:text-[var(--text-50)]" />
										</Button>
										
										<div className="flex items-center gap-3">
											<div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-xl flex items-center justify-center">
												<TrendingUp className="h-6 w-6 text-white" />
											</div>
											<div>
												<h1 className="text-3xl md:text-4xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)]">
													{symbol}
												</h1>
												<div className="flex items-center gap-2 mt-1">
													<Badge variant="outline" className="text-xs text-[var(--text-700)] dark:text-[var(--text-300)] border-[var(--primary-500)]/30 dark:border-[var(--primary-400)]/50">
														<Activity className="w-3 h-3 mr-1 text-[var(--primary-500)] dark:text-[var(--primary-400)]" />
														Real-time Data
													</Badge>
												</div>
											</div>
										</div>
									</div>

									{/* Price Display */}
									<div className="flex items-baseline gap-4 mb-4">
										<div className="text-4xl md:text-5xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)]">
											${latestPrice}
										</div>
										{priceChange && (
											<div className={`flex items-center gap-1 text-lg font-semibold ${
												isPriceUp 
													? "text-green-600 dark:text-green-400" 
													: "text-red-600 dark:text-red-400"
											}`}>
												{isPriceUp ? (
													<ArrowUp className="h-5 w-5" />
												) : (
													<ArrowDown className="h-5 w-5" />
												)}
												<span>${Math.abs(priceChange)}</span>
												<span>({percentChange}%)</span>
											</div>
										)}
									</div>

									{/* Key Metrics */}
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										<div className="bg-[var(--background-200)] dark:bg-[var(--background-300)] rounded-lg p-3">
											<div className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">Open</div>
											<div className="text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)]">
												${metrics.open || "--"}
											</div>
										</div>
										<div className="bg-[var(--background-200)] dark:bg-[var(--background-300)] rounded-lg p-3">
											<div className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">High</div>
											<div className="text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)]">
												${metrics.high || "--"}
											</div>
										</div>
										<div className="bg-[var(--background-200)] dark:bg-[var(--background-300)] rounded-lg p-3">
											<div className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">Low</div>
											<div className="text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)]">
												${metrics.low || "--"}
											</div>
										</div>
										<div className="bg-[var(--background-200)] dark:bg-[var(--background-300)] rounded-lg p-3">
											<div className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">Volume</div>
											<div className="text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)]">
												{metrics.volume || "--"}
											</div>
										</div>
									</div>
								</div>

								{/* Right Side - Quick Actions */}
								<div className="flex flex-col gap-3">
									<div className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)] mb-2">
										Quick Actions
									</div>
									<Button
										onClick={handleAddToWatchlist}
										variant="outline"
										className="w-full justify-start hover:bg-[var(--primary-100)] dark:hover:bg-[var(--primary-800)] text-[var(--text-700)] dark:text-[var(--text-300)] border-[var(--primary-300)] dark:border-[var(--primary-600)] transition-all duration-200"
									>
										<BarChart2 className="w-4 h-4 mr-2" />
										Add to Watchlist
									</Button>
									<Button
										onClick={handleSetPriceAlert}
										variant="outline"
										className="w-full justify-start hover:bg-[var(--primary-100)] dark:hover:bg-[var(--primary-800)] text-[var(--text-700)] dark:text-[var(--text-300)] border-[var(--primary-300)] dark:border-[var(--primary-600)] transition-all duration-200"
									>
										<Zap className="w-4 h-4 mr-2" />
										Set Price Alert
									</Button>
									<Button
										onClick={handleViewFundamentals}
										variant="outline"
										className="w-full justify-start hover:bg-[var(--primary-100)] dark:hover:bg-[var(--primary-800)] text-[var(--text-700)] dark:text-[var(--text-300)] border-[var(--primary-300)] dark:border-[var(--primary-600)] transition-all duration-200"
									>
										<DollarSign className="w-4 h-4 mr-2" />
										View Fundamentals
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Loading State */}
				{isFetching && (
					<div className="flex items-center justify-center py-12">
						<div className="flex items-center gap-3">
							<Loader2 className="h-6 w-6 animate-spin text-[var(--primary-500)]" />
							<span className="text-[var(--text-700)] dark:text-[var(--text-300)]">
								Loading {symbol} data...
							</span>
						</div>
					</div>
				)}

				{/* Error State */}
				{error && (
					<Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
									<Activity className="h-5 w-5 text-red-600 dark:text-red-400" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
										Error Loading Data
									</h3>
									<p className="text-red-600 dark:text-red-400 mt-1">
										{error}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Chart Section */}
				{!isFetching && !error && processedData.length > 0 && (
					<div className="analytics-chart">
						<ChartSection stockData={processedData} />
					</div>
				)}

				{/* Technical Indicators Section */}
				{!isFetching && !error && processedData.length > 0 && (
					<div className="analytics-technical">
						<TechnicalIndicators stockData={processedData} />
					</div>
				)}
			</div>

			{/* Modals */}
			<AddToWatchlistModal
				isOpen={isAddToWatchlistOpen}
				onClose={() => setIsAddToWatchlistOpen(false)}
				symbol={symbol}
			/>
			<PriceAlertModal
				isOpen={isPriceAlertOpen}
				onClose={() => setIsPriceAlertOpen(false)}
				symbol={symbol}
				currentPrice={latestPrice}
			/>
			<FundamentalsModal
				isOpen={isFundamentalsOpen}
				onClose={() => setIsFundamentalsOpen(false)}
				symbol={symbol}
			/>
		</div>
	);
};

export default AnalyticsPage;
