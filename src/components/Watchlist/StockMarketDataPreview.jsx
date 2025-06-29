import React from "react";
import moment from "moment";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Clock } from "lucide-react";

const StockMarketDataPreview = ({ previewStockData, isMobile = false }) => {
	if (!previewStockData) return null;

	const {
		price,
		change,
		changePercent,
		dayHigh,
		dayLow,
		volume,
		fiftyTwoWeekHigh,
		fiftyTwoWeekLow,
		marketCap,
		updatedAt,
		marketState = "OPEN",
	} = previewStockData;

	const isPositive = change >= 0;

	return (
		<div className="space-y-4">
			{/* Current Price Card */}
			<Card className="bg-gradient-to-r from-[var(--primary-50)] to-[var(--accent-50)] dark:from-[var(--primary-900)] dark:to-[var(--accent-900)] border-[var(--primary-200)] dark:border-[var(--primary-700)]">
				<CardContent className="p-4">
					<div className="flex justify-between items-center">
						<div>
							<p className="text-sm text-[var(--text-600)] dark:text-[var(--text-300)] font-medium">
								Current Price
							</p>
							<p className="text-2xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
								${price?.toFixed(2)}
							</p>
						</div>
						<div className="text-right">
							<div className="flex items-center gap-1 mb-1">
								{isPositive ? (
									<TrendingUp className="w-4 h-4 text-[var(--accent-500)]" />
								) : (
									<TrendingDown className="w-4 h-4 text-[var(--secondary-500)]" />
								)}
								<p className="text-sm text-[var(--text-600)] dark:text-[var(--text-300)]">
									Daily Change
								</p>
							</div>
							<p className={`text-lg font-bold ${isPositive ? 'text-[var(--accent-600)]' : 'text-[var(--secondary-600)]'} dark:text-[var(--text-50)]`}>
								${change?.toFixed(2)} ({changePercent?.toFixed(2)}%)
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Day High/Low Grid */}
			<div className="grid grid-cols-2 gap-3">
				<Card className="bg-[var(--background-50)] dark:bg-[var(--background-100)] border-[var(--background-200)] dark:border-[var(--background-300)]">
					<CardContent className="p-3">
						<p className="text-xs text-[var(--text-600)] dark:text-[var(--text-400)] font-medium mb-1">
							Day High
						</p>
						<p className="text-base font-semibold text-[var(--text-900)] dark:text-[var(--text-50)]">
							${dayHigh?.toFixed(2)}
						</p>
					</CardContent>
				</Card>
				<Card className="bg-[var(--background-50)] dark:bg-[var(--background-100)] border-[var(--background-200)] dark:border-[var(--background-300)]">
					<CardContent className="p-3">
						<p className="text-xs text-[var(--text-600)] dark:text-[var(--text-400)] font-medium mb-1">
							Day Low
						</p>
						<p className="text-base font-semibold text-[var(--text-900)] dark:text-[var(--text-50)]">
							${dayLow?.toFixed(2)}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Volume and Market Cap */}
			<div className="grid grid-cols-2 gap-3">
				<Card className="bg-[var(--background-50)] dark:bg-[var(--background-100)] border-[var(--background-200)] dark:border-[var(--background-300)]">
					<CardContent className="p-3">
						<p className="text-xs text-[var(--text-600)] dark:text-[var(--text-400)] font-medium mb-1">
							Volume
						</p>
						<p className="text-base font-semibold text-[var(--text-900)] dark:text-[var(--text-50)]">
							{volume?.toLocaleString()}
						</p>
					</CardContent>
				</Card>
				<Card className="bg-[var(--background-50)] dark:bg-[var(--background-100)] border-[var(--background-200)] dark:border-[var(--background-300)]">
					<CardContent className="p-3">
						<p className="text-xs text-[var(--text-600)] dark:text-[var(--text-400)] font-medium mb-1">
							Market Cap
						</p>
						<p className="text-base font-semibold text-[var(--text-900)] dark:text-[var(--text-50)]">
							{marketCap ? `$${(marketCap / 1e9).toFixed(2)}B` : "N/A"}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* 52 Week Range */}
			<Card className="bg-[var(--background-50)] dark:bg-[var(--background-100)] border-[var(--background-200)] dark:border-[var(--background-300)]">
				<CardContent className="p-4">
					<div className="flex justify-between items-center">
						<div>
							<p className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)] font-medium mb-1">
								52 Week Range
							</p>
							<p className="text-base font-semibold text-[var(--text-900)] dark:text-[var(--text-50)]">
								${fiftyTwoWeekLow?.toFixed(2)} - ${fiftyTwoWeekHigh?.toFixed(2)}
							</p>
						</div>
						<div className="text-right">
							<div className="flex items-center gap-1 mb-1">
								<Clock className="w-4 h-4 text-[var(--text-500)] dark:text-[var(--text-400)]" />
								<p className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)] font-medium">
									Status
								</p>
							</div>
							<p className={`text-base font-semibold ${
								marketState === "OPEN" 
									? "text-[var(--accent-600)]" 
									: "text-[var(--secondary-600)]"
							} dark:text-[var(--text-50)]`}>
								{marketState === "OPEN" ? "Open" : "Closed"}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Last Updated */}
			<div className="text-center pt-2">
				<p className="text-xs text-[var(--text-500)] dark:text-[var(--text-400)]">
					Last updated: {moment(updatedAt || new Date()).format("MMM D, h:mm A")}
				</p>
			</div>
		</div>
	);
};

export default StockMarketDataPreview;
