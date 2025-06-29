import WatchlistCard from "./WatchlistCard";
import BackButton from "../BackButton";
import useStore from "../../context/Store";
import { FolderOpen, Plus } from "lucide-react";

const Watchlist = ({ loading, showBackButton = false }) => {
	const { watchlists } = useStore();

	return (
		<div className="space-y-6">
			{/* Header with Back Button */}
			{showBackButton && (
				<BackButton locationAddress="/dashboard" locationName="Back to Dashboard" />
			)}

			{/* Main Content */}
			<div className="bg-[var(--background-100)] dark:bg-[var(--background-200)] shadow-lg rounded-xl border border-[var(--background-200)] dark:border-[var(--background-300)] transition-all duration-500 ease-in-out">
				{loading ? (
					<div className="p-8">
						<div className="animate-pulse space-y-6">
							{/* Header Skeleton */}
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<div className="h-6 bg-[var(--background-300)] dark:bg-[var(--background-400)] rounded w-48"></div>
									<div className="h-4 bg-[var(--background-300)] dark:bg-[var(--background-400)] rounded w-64"></div>
								</div>
								<div className="h-10 bg-[var(--background-300)] dark:bg-[var(--background-400)] rounded-lg w-32"></div>
							</div>
							
							{/* Cards Skeleton */}
							<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
								{[1, 2, 3].map((i) => (
									<div key={i} className="space-y-3">
										<div className="h-4 bg-[var(--background-300)] dark:bg-[var(--background-400)] rounded w-3/4"></div>
										<div className="h-3 bg-[var(--background-300)] dark:bg-[var(--background-400)] rounded w-1/2"></div>
										<div className="h-3 bg-[var(--background-300)] dark:bg-[var(--background-400)] rounded w-2/3"></div>
									</div>
								))}
							</div>
						</div>
					</div>
				) : watchlists.length === 0 ? (
					<div className="p-12 text-center">
						<div className="w-20 h-20 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-full flex items-center justify-center mx-auto mb-6">
							<FolderOpen className="w-10 h-10 text-white" />
						</div>
						<h3 className="text-xl font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-2">
							No Watchlists Yet
						</h3>
						<p className="text-[var(--text-600)] dark:text-[var(--text-400)] mb-6 max-w-md mx-auto">
							Create your first watchlist to start tracking your favorite stocks and build your investment portfolio.
						</p>
						<div className="flex items-center justify-center gap-2 text-[var(--text-500)] dark:text-[var(--text-400)]">
							<Plus className="w-4 h-4" />
							<span className="text-sm">Click "Create Watchlist" to get started</span>
						</div>
					</div>
				) : (
					<div className="p-6">
						{/* Header */}
						<div className="flex items-center justify-between mb-6">
							<div>
								<h2 className="text-2xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
									Your Watchlists
								</h2>
								<p className="text-[var(--text-600)] dark:text-[var(--text-400)] mt-1">
									{watchlists.length} watchlist{watchlists.length !== 1 ? 's' : ''} • Manage your stock portfolios
								</p>
							</div>
						</div>

						{/* Watchlist Grid */}
						<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-h-[60vh] overflow-y-auto scrollable-content">
							{watchlists.map((watchlist) => (
								<div key={watchlist._id} className="transition-transform duration-200 hover:scale-[1.02]">
									<WatchlistCard watchlist={watchlist} />
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Watchlist;
