import React from 'react'
import StockPreview from "./StockPreview";
import StockMarketDataPreview from "./StockMarketDataPreview";
import StockPreviewSkeleton from "./StockPreviewSkeleton";
import { ListRestart } from 'lucide-react';

const StockPreviewBox = ({ previewStock, previewStockData, setPreviewStock }) => {
	return (
	<div className="col-span-1 bg-[var(--secondary-100)] shadow-sm rounded-xl px-4 py-4 border border-[var(--accent-200)] max-h-fit transition-all duration-500 ease-in-out min-h-fit">
		{previewStock && <div>
			<ListRestart
				className="cursor-pointer place-self-end mb-4 mr-2"
				size={26}
				color="var(--text-950)"
				onClick={() => setPreviewStock(null)}
			/>
		</div>}
		{previewStock ? (
			<div className="space-y-6 bg-[var(--background-50)] text-[var(--text-800)] p-4 rounded-2xl shadow-md">
				{/* Watchlist Info */}
				<StockPreview 
					previewStock={previewStock}
				/>

				{/* Market Data */}
				<div className="pt-4 border-t border-[var(--accent-100)] space-y-2">
					<h3 className="text-lg font-semibold text-[var(--text-950)] mb-1">
						Market Data
					</h3>

					{previewStockData &&
					previewStock.symbol ===
						previewStockData.symbol ? (
						<StockMarketDataPreview
							previewStockData={previewStockData}
						/>
					) : (
						<StockPreviewSkeleton />
					)}
				</div>
			</div>
		) : (
			<p className="text-gray-600 text-sm">
				Select a stock to preview its analytics here.
			</p>
		)}
	</div>
	)
}

export default StockPreviewBox