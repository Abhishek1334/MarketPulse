import { Calendar, BarChart3, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WatchlistHeader = ({ watchlistData }) => {
	return (
		<Card className="bg-gradient-to-br from-[var(--primary-50)] via-[var(--primary-100)] to-[var(--accent-50)] dark:from-[var(--primary-900)] dark:via-[var(--primary-800)] dark:to-[var(--accent-900)] border-[var(--primary-200)] dark:border-[var(--primary-700)] shadow-xl">
			<CardContent className="p-6 sm:p-8">
				<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
					{/* Title and Description */}
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-3">
							<div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-xl flex items-center justify-center shadow-lg">
								<BarChart3 className="w-6 h-6 text-white" />
							</div>
							<h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[var(--text-900)] to-[var(--primary-600)] dark:from-[var(--text-50)] dark:to-[var(--primary-300)] bg-clip-text text-transparent">
								{watchlistData.name || "Loading Watchlist..."}
							</h1>
						</div>
						
						{watchlistData.description && (
							<div className="flex items-start gap-2 mt-3">
								<FileText className="w-4 h-4 text-[var(--text-600)] dark:text-[var(--text-400)] mt-0.5 flex-shrink-0" />
								<p className="text-[var(--text-600)] dark:text-[var(--text-300)] text-base leading-relaxed">
									{watchlistData.description}
								</p>
							</div>
						)}
					</div>

					{/* Stats */}
					<div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
						<div className="flex items-center gap-2 px-4 py-3 bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm rounded-xl border border-[var(--background-200)] dark:border-[var(--background-300)] shadow-sm">
							<Calendar className="w-4 h-4 text-[var(--primary-500)] dark:text-[var(--primary-400)]" />
							<div className="flex flex-col">
								<span className="text-xs text-[var(--text-500)] dark:text-[var(--text-400)] font-medium">Created</span>
								<span className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)]">
									{new Date(watchlistData.createdAt).toLocaleDateString()}
								</span>
							</div>
						</div>
						
						<div className="flex items-center gap-2 px-4 py-3 bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm rounded-xl border border-[var(--background-200)] dark:border-[var(--background-300)] shadow-sm">
							<BarChart3 className="w-4 h-4 text-[var(--accent-500)] dark:text-[var(--accent-400)]" />
							<div className="flex flex-col">
								<span className="text-xs text-[var(--text-500)] dark:text-[var(--text-400)] font-medium">Stocks</span>
								<span className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)]">
									{watchlistData.stocks?.length || 0}
								</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default WatchlistHeader;
