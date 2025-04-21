const WatchlistHeader = ({watchlistData}) => {
	return (
			<div className="col-span-3 bg-[var(--background-100)] shadow-md rounded-xl px-6 py-4">
				<h1 className="text-3xl font-bold text-[var(--text-950)]">
					{watchlistData.name || "Loading Watchlist..."}
				</h1>
			</div>
	);
}

export default WatchlistHeader