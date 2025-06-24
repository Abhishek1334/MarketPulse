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
			<div className="bg-[var(--background-50)] rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-[var(--background-200)]">
				<div className="animate-pulse space-y-4">
					<div className="h-6 sm:h-8 bg-[var(--background-200)] rounded-lg w-1/2 sm:w-1/3"></div>
					<div className="h-20 sm:h-24 bg-[var(--background-200)] rounded-lg"></div>
					<div className="h-20 sm:h-24 bg-[var(--background-200)] rounded-lg"></div>
				</div>
			</div>
		);
	}

	if (watchlistError) {
		return (
			<div className="text-[var(--accent-600)] bg-[var(--accent-50)] p-4 rounded-xl text-sm sm:text-base">
				Error loading watchlist: {watchlistErrorData?.message}
			</div>
		);
	}

	const { Watchlist } = watchlistData;

	return (
		<div className="bg-[var(--background-50)] rounded-xl sm:rounded-2xl shadow-lg border border-[var(--background-200)] h-full flex flex-col">
			{/* Header */}
			<div className="p-4 sm:p-6 border-b border-[var(--background-200)]">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
					<h2 className="text-xl sm:text-2xl font-bold text-[var(--text-900)]">
						Stock Portfolio
					</h2>
					<div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
						<AddStock watchlistId={watchlistId} />
						<span className="text-sm sm:text-base text-[var(--text-600)] font-medium px-3 sm:px-4 py-2 bg-[var(--background-100)] rounded-lg whitespace-nowrap">
							{Watchlist.stocks?.length} Stock{Watchlist.stocks?.length !== 1 ? 's' : ''}
						</span>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 min-h-0 p-4 sm:p-6">
				{Watchlist.stocks?.length > 0 ? (
					<div className="space-y-3 sm:space-y-4 h-full overflow-auto scrollable-content">
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
					<div className="text-center py-8 sm:py-12 bg-[var(--background-100)] rounded-xl h-full flex flex-col items-center justify-center">
						<div className="max-w-xs sm:max-w-sm mx-auto">
							<p className="text-[var(--text-600)] text-base sm:text-lg mb-2">
								No stocks in this watchlist yet.
							</p>
							<p className="text-[var(--text-500)] text-sm sm:text-base">
								Click "Add Stock" to get started
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default StockList;
