const WatchlistHeader = ({ watchlistData }) => {
	return (
		<div className="col-span-full bg-gradient-to-r from-[var(--primary-50)] to-[var(--primary-200)] rounded-2xl shadow-lg px-8 py-2 transition-all duration-500 ease-in-out h-fit">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<h1 className="text-3xl font-bold text-[var(--text-900)]">
					{watchlistData.name || "Loading Watchlist..."}
				</h1>
				<div className="flex items-center gap-4">
					<span className="px-4 py-2 bg-white/10 rounded-lg text-[var(--text-700)] text-sm font-medium">
						Created{" "}
						{new Date(watchlistData.createdAt).toLocaleDateString()}
					</span>
					<span className="px-4 py-2 bg-white/10 rounded-lg text-[var(--text-700)] text-sm font-medium">
						{watchlistData.stocks?.length || 0} Stocks
					</span>
				</div>
			</div>
			{watchlistData.description && (
				<p className="mt-2 text-white/80">
					{watchlistData.description}
				</p>
			)}
		</div>
	);
};

export default WatchlistHeader;
