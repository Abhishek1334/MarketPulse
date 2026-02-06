import useStore from "@/context/Store";

const SummaryCards = ({ loading }) => {
	const { watchlists } = useStore();

	const totalWatchlist = Array.isArray(watchlists) ? watchlists.length : 0;
	const totalStocksTracked = Array.isArray(watchlists)
		? watchlists.reduce(
				(total, watchlist) => total + (watchlist.stocks?.length || 0),
				0
		)
		: 0;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
			<div className="summaryCard p-4 sm:p-6">
				<span className="font-Nunito text-lg sm:text-xl md:text-2xl font-bold block mb-2 sm:mb-3">
					Total Watchlists
				</span>
				<div className="text-2xl sm:text-3xl md:text-4xl font-semibold">
					{loading ? (
						<div className="flex items-center pt-2 sm:pt-4">
							<div className="loader"></div>
						</div>
					) : (
						<span>{totalWatchlist}</span>
					)}
				</div>
			</div>
			<div className="summaryCard p-4 sm:p-6">
				<span className="font-Nunito text-lg sm:text-xl md:text-2xl font-bold block mb-2 sm:mb-3">
					Total Stocks Tracked
				</span>
				<div className="text-2xl sm:text-3xl md:text-4xl font-semibold">
					{loading ? (
						<div className="flex items-center pt-2 sm:pt-4">
							<div className="loader"></div>
						</div>
					) : (
						<span>{totalStocksTracked}</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default SummaryCards;
