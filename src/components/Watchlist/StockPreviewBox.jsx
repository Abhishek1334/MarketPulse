import React from "react";
import StockPreview from "./StockPreview";
import StockMarketDataPreview from "./StockMarketDataPreview";
import StockPreviewSkeleton from "./StockPreviewSkeleton";
import { ListRestart } from "lucide-react";

const StockPreviewBox = ({ previewStock, setPreviewStock, stockData }) => {
	const previewStockData = stockData?.find(
		(stock) => stock.symbol === previewStock?.symbol
	);

	return (
		<div className="bg-[var(--background-50)] rounded-2xl shadow-lg p-6 border border-[var(--background-200)] h-fit sticky max-h-[calc(100vh-19rem)] overflow-auto scrollable-content">
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
