import React from "react";
import StockPreview from "./StockPreview";
import StockMarketDataPreview from "./StockMarketDataPreview";
import StockPreviewSkeleton from "./StockPreviewSkeleton";
import { ListRestart, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const StockPreviewBox = ({ previewStock, setPreviewStock, stockData, isMobile = false }) => {
	const previewStockData = stockData?.find(
		(stock) => stock.symbol === previewStock?.symbol
	);

	if (isMobile) {
		return (
			<Card className="bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm border-[var(--background-200)] dark:border-[var(--background-300)] shadow-lg">
				<CardContent className="p-4 sm:p-6">
					{previewStock ? (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-lg sm:text-xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
									Stock Details
								</h2>
								<button
									onClick={() => setPreviewStock(null)}
									className="p-2 rounded-lg hover:bg-[var(--background-200)] dark:hover:bg-[var(--background-300)] transition-colors"
								>
									<X className="w-5 h-5 text-[var(--text-600)] dark:text-[var(--text-400)]" />
								</button>
							</div>

							<div className="space-y-6">
								<StockPreview previewStock={previewStock} />

								<div className="pt-4 sm:pt-6 border-t border-[var(--background-200)] dark:border-[var(--background-300)]">
									<h3 className="text-base sm:text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-3 sm:mb-4">
										Market Data
									</h3>
									{previewStockData &&
									previewStock.symbol === previewStockData.symbol ? (
										<StockMarketDataPreview
											previewStockData={previewStockData}
											isMobile={true}
										/>
									) : (
										<StockPreviewSkeleton />
									)}
								</div>
							</div>
						</div>
					) : (
						<div className="text-center py-8 sm:py-12">
							<div className="w-16 h-16 bg-gradient-to-br from-[var(--primary-100)] to-[var(--accent-100)] dark:from-[var(--primary-900)] dark:to-[var(--accent-900)] rounded-full flex items-center justify-center mx-auto mb-4">
								<ListRestart className="w-8 h-8 text-[var(--primary-500)] dark:text-[var(--primary-400)]" />
							</div>
							<p className="text-[var(--text-600)] dark:text-[var(--text-400)] text-sm sm:text-base">
								Select a stock to view detailed information
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm border-[var(--background-200)] dark:border-[var(--background-300)] shadow-lg h-fit sticky top-4">
			<CardContent className="p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
						Stock Details
					</h2>
					{previewStock && (
						<button
							onClick={() => setPreviewStock(null)}
							className="p-2 rounded-lg hover:bg-[var(--background-200)] dark:hover:bg-[var(--background-300)] transition-colors"
						>
							<ListRestart className="w-5 h-5 text-[var(--text-600)] dark:text-[var(--text-400)] cursor-pointer hover:text-[var(--primary-600)] dark:hover:text-[var(--primary-400)] transition-colors" />
						</button>
					)}
				</div>

				{previewStock ? (
					<div className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto scrollable-content">
						<StockPreview previewStock={previewStock} />

						<div className="pt-6 border-t border-[var(--background-200)] dark:border-[var(--background-300)]">
							<h3 className="text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-4">
								Market Data
							</h3>
							{previewStockData &&
							previewStock.symbol === previewStockData.symbol ? (
								<StockMarketDataPreview
									previewStockData={previewStockData}
								/>
							) : (
								<StockPreviewSkeleton />
							)}
						</div>
					</div>
				) : (
					<div className="text-center py-12">
						<div className="w-20 h-20 bg-gradient-to-br from-[var(--primary-100)] to-[var(--accent-100)] dark:from-[var(--primary-900)] dark:to-[var(--accent-900)] rounded-full flex items-center justify-center mx-auto mb-6">
							<ListRestart className="w-10 h-10 text-[var(--primary-500)] dark:text-[var(--primary-400)]" />
						</div>
						<h3 className="text-lg font-semibold text-[var(--text-700)] dark:text-[var(--text-300)] mb-2">
							No Stock Selected
						</h3>
						<p className="text-[var(--text-600)] dark:text-[var(--text-400)] text-sm">
							Select a stock from the list to view detailed information
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default StockPreviewBox;
