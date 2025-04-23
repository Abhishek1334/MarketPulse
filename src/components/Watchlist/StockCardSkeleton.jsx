const StockCardSkeleton = () => {
	return (
		<div className="bg-[var(--secondary-50)] rounded-xl shadow-sm p-4 grid grid-cols-4 gap-4 items-center border border-[var(--secondary-200)] animate-pulse">
			<div>
				<div className="h-5 w-20 bg-gray-400/40 rounded mb-2" />
				<div className="h-4 w-24 bg-gray-400/30 rounded" />
			</div>

			<div>
				<div className="h-4 w-16 bg-gray-400/30 rounded mb-1" />
				<div className="h-5 w-12 bg-gray-400/40 rounded" />
			</div>

			<div className="col-span-2">
				<div className="h-4 w-16 bg-gray-400/30 rounded mb-1" />
				<div className="h-5 w-full bg-gray-400/40 rounded" />
			</div>
		</div>
	);
};


export default StockCardSkeleton