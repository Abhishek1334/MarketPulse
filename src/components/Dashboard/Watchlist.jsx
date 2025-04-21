import WatchlistCard from "./WatchlistCard";
import useStore from "../../context/Store";

const Watchlist = ({ loading }) => {

	const { watchlists, setWatchlists, deleteWatchlist } = useStore();

	

	return (
		<div className="mt-9 p-10 bg-[var(--background-100)] shadow-md rounded-lg relative transition-all duration-500 ease-in-out">
			{loading ? (
				<div className="flex items-center justify-center h-32">
					<div className="loader"></div>
				</div>
			) : watchlists.length === 0 ? (
				<div className="text-center text-gray-500 p-6">
					<p>No watchlists available.</p>
				</div>
			) : (
				<ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					{watchlists.map((watchlist) => (
						<WatchlistCard
							key={watchlist._id}
							watchlist={watchlist}
						/>
					))}
				</ul>
			)}
		</div>
	);
};

export default Watchlist;
