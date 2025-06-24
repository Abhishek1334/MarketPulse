import React from "react";
import StockPreview from "./StockPreview";
import StockMarketDataPreview from "./StockMarketDataPreview";
import StockPreviewSkeleton from "./StockPreviewSkeleton";
import { ListRestart, X } from "lucide-react";

const StockPreviewBox = ({ previewStock, setPreviewStock, stockData, isMobile = false }) => {
	const previewStockData = stockData?.find(
		(stock) => stock.symbol === previewStock?.symbol
	);

	if (isMobile) {
		return (
			<div className="bg-[var(--background-50)] rounded-xl shadow-lg border border-[var(--background-200)] overflow-hidden">
				{previewStock ? (
					<div className="p-4 sm:p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg sm:text-xl font-bold text-[var(--text-900)]">
								Stock Details
							</h2>
							<button
								onClick={() => setPreviewStock(null)}
								className="p-2 rounded-lg hover:bg-[var(--background-100)] transition-colors"
							>
								<X className="w-5 h-5 text-[var(--text-600)]" />
							</button>
						</div>

						<div className="space-y-6">
							<StockPreview previewStock={previewStock} />

							<div className="pt-4 sm:pt-6 border-t border-[var(--background-200)]">
								<h3 className="text-base sm:text-lg font-semibold text-[var(--text-900)] mb-3 sm:mb-4">
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
					<div className="text-center py-8 sm:py-12 bg-[var(--background-100)] rounded-xl m-4">
						<p className="text-[var(--text-600)] text-sm sm:text-base">
							Select a stock to view detailed information
						</p>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="bg-[var(--background-50)] rounded-2xl shadow-lg p-6 border border-[var(--background-200)] h-fit sticky top-4 max-h-[calc(100vh-8rem)] overflow-auto scrollable-content">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold text-[var(--text-900)]">
					Stock Details
				</h2>
				{previewStock && (
					<ListRestart
						className="cursor-pointer hover:text-[var(--primary-600)] transition-colors"
						size={24}
						onClick={() => setPreviewStock(null)}
					/>
				)}
			</div>

			{previewStock ? (
				<div className="space-y-8">
					<StockPreview previewStock={previewStock} />

					<div className="pt-6 border-t border-[var(--background-200)]">
						<h3 className="text-xl font-semibold text-[var(--text-900)] mb-4">
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
				<div className="text-center py-12 bg-[var(--background-100)] rounded-xl">
					<p className="text-[var(--text-600)]">
						Select a stock to view detailed information
					</p>
				</div>
			)}
		</div>
	);
};

export default StockPreviewBox;
