import  useStore from "@/context/Store";

const SummaryCards = ({ loading }) => {
	const { watchlists } = useStore();

	const totalWatchlist = watchlists.length;
	const totalStocksTracked = watchlists.reduce(
		(total, watchlist) => total + watchlist.stocks.length,
		0
	);

	return (
		<div className=" flex flex-row   md:grid-cols-2 gap-6 ">
			<div className="summaryCard">
				<span className="font-Nunito  text-2xl max-md:text-lg font-bold max-md:font-semibold">
					Total Watchlists
				</span>
				<div className="text-3xl max-sm:text-xl font-semibold place-self-end">
					{loading ? (
						<div className="flex items-center pt-4 max-md:items-center">
							<div className="loader"></div>
						</div>
					) : (
						<span>{totalWatchlist}</span>
					)}
				</div>
			</div>
			<div className="summaryCard">
				<span className="font-Nunito  text-2xl max-md:text-lg font-bold max-md:font-semibold">
					Total Stocks Tracked
				</span>
				<div className="text-3xl max-sm:text-xl font-semibold place-self-end">
					{loading ? (
						<div className="flex items-center pt-4 max-sm:items-center">
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
