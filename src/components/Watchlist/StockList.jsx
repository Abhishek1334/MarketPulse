import { useQuery } from "@tanstack/react-query";
import StockCard from "./StockCard";
import AddStock from "./AddStock";
import { getASingleWatchlist } from "@/api/watchlist";
import StockCardSkeleton from "./StockCardSkeleton";

const StockList = ({ watchlistId, loading, handlePreviewStock }) => {
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
			<div className="bg-[var(--background-50)] rounded-2xl shadow-lg p-6 border border-[var(--background-200)]">
				<div className="animate-pulse space-y-4">
					<div className="h-8 bg-[var(--background-200)] rounded-lg w-1/3"></div>
					<div className="h-24 bg-[var(--background-200)] rounded-lg"></div>
					<div className="h-24 bg-[var(--background-200)] rounded-lg"></div>
				</div>
			</div>
		);
	}

	if (watchlistError) {
		return (
			<div className="text-[var(--accent-600)] bg-[var(--accent-50)] p-4 rounded-xl">
				Error loading watchlist: {watchlistErrorData?.message}
			</div>
		);
	}

	const { Watchlist } = watchlistData;

	return (
		<div className="bg-[var(--background-50)] rounded-2xl shadow-lg p-6 border border-[var(--background-200)] max-h-[calc(100vh-19rem)] overflow-hidden">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
				<h2 className="text-2xl font-bold text-[var(--text-900)]">
					Stock Portfolio
				</h2>
				<div className="flex items-center gap-4">
					<AddStock watchlistId={watchlistId} />
					<span className="text-[var(--text-600)] font-medium px-4 py-2 bg-[var(--background-100)] rounded-lg">
						{Watchlist.stocks?.length} Stocks
					</span>
				</div>
			</div>

			{Watchlist.stocks?.length > 0 ? (
				<div className="space-y-4 max-h-[calc(100vh-20rem)] overflow-auto scrollable-content">
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
				<div className="text-center py-12 bg-[var(--background-100)] rounded-xl">
					<p className="text-[var(--text-600)] text-lg">
						No stocks in this watchlist yet.
					</p>
					<p className="text-[var(--text-500)] mt-2">
						Click "Add Stock" to get started
					</p>
				</div>
			)}
		</div>
	);
};

export default StockList;
