import React, { useState, useEffect } from "react";
import { X, Building2, TrendingUp, Users, DollarSign, BarChart3, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { showError, showInfo } from "@/utils/toast";

const FundamentalsModal = ({ isOpen, onClose, symbol }) => {
	const [fundamentals, setFundamentals] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen && symbol) {
			fetchFundamentals();
		}
	}, [isOpen, symbol]);

	const fetchFundamentals = async () => {
		try {
			setIsLoading(true);
			// Simulate API call - in a real app, you'd call your fundamentals API
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			// Mock data - replace with actual API call
			const mockFundamentals = {
				companyName: `${symbol} Corporation`,
				sector: "Technology",
				industry: "Software",
				marketCap: "$2.5T",
				peRatio: "25.4",
				dividendYield: "0.5%",
				beta: "1.2",
				volume: "45.2M",
				avgVolume: "42.1M",
				dayRange: "$150.25 - $155.80",
				yearRange: "$120.50 - $180.75",
				revenue: "$394.3B",
				profitMargin: "25.8%",
				roe: "147.5%",
				debtToEquity: "0.15",
				currentRatio: "1.8",
				quickRatio: "1.6"
			};
			
			setFundamentals(mockFundamentals);
		} catch (error) {
			showError("Failed to load fundamentals data");
			console.error("Error fetching fundamentals:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		onClose();
		setFundamentals(null);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<Card className="w-full max-w-4xl max-h-[90vh] bg-[var(--background-100)] dark:bg-[var(--background-200)] border-[var(--background-200)] dark:border-[var(--background-300)] shadow-2xl transition-all duration-300 overflow-hidden">
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<CardTitle className="text-xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
							Fundamentals - {symbol}
						</CardTitle>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleClose}
							className="hover:bg-[var(--background-200)] dark:hover:bg-[var(--background-300)] transition-colors duration-200"
						>
							<X className="h-4 w-4 text-[var(--text-600)] dark:text-[var(--text-400)]" />
						</Button>
					</div>
				</CardHeader>
				<CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
					{isLoading ? (
						<div className="flex items-center justify-center py-12">
							<div className="text-center">
								<Loader2 className="h-8 w-8 animate-spin text-[var(--primary-500)] mx-auto mb-4" />
								<p className="text-[var(--text-600)] dark:text-[var(--text-400)]">Loading fundamentals data...</p>
							</div>
						</div>
					) : fundamentals ? (
						<div className="space-y-6">
							{/* Company Overview */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Card className="bg-[var(--background-200)] dark:bg-[var(--background-300)] border-[var(--background-300)] dark:border-[var(--background-400)]">
									<CardHeader className="pb-3">
										<CardTitle className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)] flex items-center gap-2">
											<Building2 className="h-4 w-4 text-[var(--primary-500)]" />
											Company Overview
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="flex justify-between">
											<span className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">Company Name:</span>
											<span className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.companyName}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">Sector:</span>
											<span className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.sector}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">Industry:</span>
											<span className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.industry}</span>
										</div>
									</CardContent>
								</Card>

								<Card className="bg-[var(--background-200)] dark:bg-[var(--background-300)] border-[var(--background-300)] dark:border-[var(--background-400)]">
									<CardHeader className="pb-3">
										<CardTitle className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)] flex items-center gap-2">
											<DollarSign className="h-4 w-4 text-[var(--accent-500)]" />
											Market Data
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="flex justify-between">
											<span className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">Market Cap:</span>
											<span className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.marketCap}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">P/E Ratio:</span>
											<span className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.peRatio}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">Dividend Yield:</span>
											<span className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.dividendYield}</span>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Trading Data */}
							<Card className="bg-[var(--background-200)] dark:bg-[var(--background-300)] border-[var(--background-300)] dark:border-[var(--background-400)]">
								<CardHeader className="pb-3">
									<CardTitle className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)] flex items-center gap-2">
										<BarChart3 className="h-4 w-4 text-[var(--primary-500)]" />
										Trading Data
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										<div className="space-y-2">
											<span className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)]">Volume</span>
											<div className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.volume}</div>
										</div>
										<div className="space-y-2">
											<span className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)]">Avg Volume</span>
											<div className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.avgVolume}</div>
										</div>
										<div className="space-y-2">
											<span className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)]">Day Range</span>
											<div className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.dayRange}</div>
										</div>
										<div className="space-y-2">
											<span className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)]">Year Range</span>
											<div className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.yearRange}</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Financial Metrics */}
							<Card className="bg-[var(--background-200)] dark:bg-[var(--background-300)] border-[var(--background-300)] dark:border-[var(--background-400)]">
								<CardHeader className="pb-3">
									<CardTitle className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)] flex items-center gap-2">
										<TrendingUp className="h-4 w-4 text-[var(--accent-500)]" />
										Financial Metrics
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										<div className="space-y-2">
											<span className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)]">Revenue</span>
											<div className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.revenue}</div>
										</div>
										<div className="space-y-2">
											<span className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)]">Profit Margin</span>
											<div className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.profitMargin}</div>
										</div>
										<div className="space-y-2">
											<span className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)]">ROE</span>
											<div className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.roe}</div>
										</div>
										<div className="space-y-2">
											<span className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)]">Beta</span>
											<div className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.beta}</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Liquidity Ratios */}
							<Card className="bg-[var(--background-200)] dark:bg-[var(--background-300)] border-[var(--background-300)] dark:border-[var(--background-400)]">
								<CardHeader className="pb-3">
									<CardTitle className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)] flex items-center gap-2">
										<Users className="h-4 w-4 text-[var(--primary-500)]" />
										Liquidity & Solvency
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="space-y-2">
											<span className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)]">Current Ratio</span>
											<div className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.currentRatio}</div>
										</div>
										<div className="space-y-2">
											<span className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)]">Quick Ratio</span>
											<div className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.quickRatio}</div>
										</div>
										<div className="space-y-2">
											<span className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)]">Debt/Equity</span>
											<div className="text-sm font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">{fundamentals.debtToEquity}</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-[var(--text-600)] dark:text-[var(--text-400)]">No fundamentals data available</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default FundamentalsModal; 