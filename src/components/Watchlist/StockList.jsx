import { useQuery } from "@tanstack/react-query";
import StockCard from "./StockCard";
import AddStock from "./AddStock";
import { getASingleWatchlist } from "@/api/watchlist";
import StockCardSkeleton from "./StockCardSkeleton";


const StockList = ({ watchlistId, loading, handlePreviewStock }) => {
	// 1. Always declare hooks first
	const {
		data: watchlistData,
		isLoading: watchlistLoading,
		isError: watchlistError,
		error: watchlistErrorData,
	} = useQuery({
		queryKey: ["watchlist", watchlistId],
		queryFn: () => getASingleWatchlist(watchlistId),
		enabled: !!watchlistId,
	});

	
	
	
	if (loading || watchlistLoading) {
		return (
			<div className="col-span-2 bg-[var(--background-100)] shadow-sm rounded-xl px-6 py-5">
				<div className="text-[var(--text-600)]">Loading stocks...</div>
			</div>
		);
	}

	if (watchlistError) {
		return (
			<div className="text-red-500">
				Error loading watchlist:{" "}
				{watchlistErrorData?.message || stockErrorData?.message}
			</div>
		);
	}

	// 3. Now safe to render
	const { Watchlist } = watchlistData;
	

	return (
		<div className="col-span-2 bg-[var(--background-100)] shadow-sm rounded-xl px-6 py-5">
			<div className="flex justify-between">
				<h2 className="text-xl font-semibold text-[var(--text-950)] mb-6">
					Stocks
				</h2>
				<div className="flex justify-between items-center gap-5 mb-6">
					<AddStock watchlistId={watchlistId} />
					<div className="text-[var(--text-600)] font-medium">
						{Watchlist.stocks?.length} Stocks
					</div>
				</div>
			</div>

			{Watchlist.stocks?.length > 0 ? (
				<div className="space-y-4 max-h-[63vh] overflow-auto scrollable-content px-2">
					{Watchlist.stocks.map((stock) => (
						<StockCard
							key={stock._id}
							stock={stock}
							watchlistId={watchlistId}
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
