import StockCard from "../StockCard";
import AddStock from "./AddStock";

const StockList = ({ watchlistData, loading, handlePreviewStock }) => {
	return (
		<div className="col-span-2 bg-[var(--background-100)] shadow-sm rounded-xl px-6 py-5 overflow-auto max-h-[72vh]">
			<div className="flex justify-between ">
				<h2 className="text-xl font-semibold text-[var(--text-950)] mb-6">
					Stocks
				</h2>
				<div className="flex justify-between items-center gap-5 mb-6">
					<div>
						<AddStock watchlistId={watchlistData._id} />
					</div>

					<div>
						<p className="text-[var(--text-600)]">
							{watchlistData.stocks?.length} stocks
						</p>
					</div>
				</div>
			</div>

			{loading ? (
				<div className="text-[var(--text-600)]">Loading stocks...</div>
			) : watchlistData.stocks?.length > 0 ? (
				<div className="space-y-4">
					{watchlistData.stocks.map((stock) => (
						<StockCard
							key={stock._id}
							stock={stock}
							handlePreviewStock={handlePreviewStock}
						/>
					))}
				</div>
			) : (
				<p className="text-gray-500">No stocks in this watchlist.</p>
			)}
		</div>
	);
};

export default StockList;
