import WatchlistCard from "./WatchlistCard";
import useStore from "../../context/Store";

const Watchlist = ({ loading }) => {
	const { watchlists } = useStore();


	if (watchlists.length === 0) {
		return (
			<div className="mt-9 p-10 bg-[var(--background-100)] shadow-md rounded-lg relative transition-all duration-500 ease-in-out">
				<div className="text-center">
					<h1 className="text-2xl font-bold">No Watchlists</h1>
				</div>
			</div>
		);
	}

	

	return (
		<div className="mt-4  p-10 bg-[var(--background-100)] shadow-md rounded-lg relative transition-all duration-500 ease-in-out max-md:p-3">
			{loading ? (
				<div className="animate-pulse border rounded-lg p-4 shadow-sm space-y-2 grid grid-cols-4 gap-10">
					<div className="skeleton-box">
						<div className="h-4 bg-gray-500/40 rounded "></div>
						<div className="h-4 bg-gray-400/60 rounded"></div>
						<div className="h-4 bg-gray-300/70 rounded"></div>
					</div>
					<div className="skeleton-box">
						<div className="h-4 bg-gray-200 rounded "></div>
						<div className="h-4 bg-gray-600/40 rounded"></div>
						<div className="h-4 bg-gray-300/70 rounded"></div>
					</div>
					<div className="skeleton-box">
						<div className="h-4 bg-gray-500/40 rounded "></div>
						<div className="h-4 bg-gray-400/30 rounded"></div>
						<div className="h-4 bg-gray-300/90 rounded"></div>
					</div>
				</div>
			) : watchlists.length === 0 ? (
				<div className="text-center text-gray-500 p-6">
					<p>No watchlists available.</p>
				</div>
			) : (
				<ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-h-[45vh] overflow-y-auto scrollable-content max-md:h-full">
					{watchlists.map((watchlist) => (
						<li key={watchlist._id}>
							<WatchlistCard watchlist={watchlist} />
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Watchlist;
