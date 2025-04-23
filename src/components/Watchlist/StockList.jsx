import { useQuery } from "@tanstack/react-query";
import StockCard from "./StockCard";
import AddStock from "./AddStock";
import { getASingleWatchlist } from "@/api/watchlist";
import StockCardSkeleton from "./StockCardSkeleton";

const StockList = ({ watchlistId, loading, handlePreviewStock }) => {
	const {
		data: watchlistData,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["watchlist", watchlistId],
		queryFn: () => getASingleWatchlist(watchlistId),
		enabled: !!watchlistId, // prevents firing if undefined
	});

	if (isLoading || loading) {
		return (
			<div className="col-span-2 bg-[var(--background-100)] shadow-sm rounded-xl px-6 py-5">
				<div className="text-[var(--text-600)]">Loading stocks...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="text-red-500">
				Error loading watchlist: {error.message}
			</div>
		);
	}
	const { Watchlist } = watchlistData;
	return (
		<div className="col-span-2 bg-[var(--background-100)] shadow-sm rounded-xl px-6 py-5">
			<div className="flex justify-between">
				<h2 className="text-xl font-semibold text-[var(--text-950)] mb-6">
					Stocks
				</h2>
				<div className="flex justify-between items-center gap-5 mb-6">
					<AddStock watchlistId={watchlistId} />
					{
						loading ? (
							<div className="loader"></div>
						) : (
							<div className="text-[var(--text-600)] font-medium">{Watchlist.stocks?.length} Stocks</div>
						)
					}
				</div>
			</div>

			{Watchlist.stocks?.length > 0 ? (
				<div className="space-y-4 max-h-[63vh] overflow-auto scrollable-content px-2 ">
					{loading
						? [...Array(3)].map((_, i) => (
								<StockCardSkeleton key={i} />
						))
						: Watchlist?.stocks.map((stock) => (
								<StockCard
									key={stock._id}
									stock={stock}
									watchlistId={watchlistId}
									handlePreviewStock={handlePreviewStock}
								/>
						))}
				</div>
			) : (
				<p className="text-gray-500 ">No stocks in this watchlist.</p>
			)}
		</div>
	);
};

export default StockList;
