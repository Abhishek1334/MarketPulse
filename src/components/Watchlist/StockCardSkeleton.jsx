const StockCardSkeleton = () => {
	return (
		<div className="bg-[var(--background-50)] rounded-xl p-6 shadow-lg border border-[var(--border)] animate-pulse">
			<div className="flex justify-between items-start mb-4">
			<div>
					<div className="h-5 w-20 bg-[var(--background-400)]/40 rounded mb-2" />
					<div className="h-4 w-24 bg-[var(--background-400)]/30 rounded" />
				</div>
				<div className="text-right">
					<div className="h-4 w-16 bg-[var(--background-400)]/30 rounded mb-1" />
					<div className="h-5 w-12 bg-[var(--background-400)]/40 rounded" />
			</div>
			</div>
			<div className="space-y-2">
				<div className="h-4 w-16 bg-[var(--background-400)]/30 rounded mb-1" />
				<div className="h-5 w-full bg-[var(--background-400)]/40 rounded" />
			</div>
		</div>
	);
};


export default StockCardSkeleton