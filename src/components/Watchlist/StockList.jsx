import { useQuery } from "@tanstack/react-query";
import StockCard from "./StockCard";
import AddStock from "./AddStock";
import { getASingleWatchlist } from "@/api/watchlist";
import StockCardSkeleton from "./StockCardSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Plus, Package } from "lucide-react";

const StockList = ({ watchlistId, loading, handlePreviewStock }) => {
	const {
		data: watchlistData,
		isLoading: watchlistLoading,
		isError: watchlistError,
		error: watchlistErrorData,
	} = useQuery({
		queryKey: ["watchlist", watchlistId],
		queryFn: () => getASingleWatchlist(watchlistId),
		enabled: !!watchlistId,
	});

	if (loading || watchlistLoading) {
		return (
			<Card className="bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm border-[var(--background-200)] dark:border-[var(--background-300)] shadow-xl h-full">
				<CardHeader className="border-b border-[var(--background-200)] dark:border-[var(--background-300)]">
					<div className="animate-pulse">
						<div className="h-8 bg-[var(--background-200)] dark:bg-[var(--background-300)] rounded-lg w-1/3 mb-4"></div>
						<div className="flex justify-between items-center">
							<div className="h-10 bg-[var(--background-200)] dark:bg-[var(--background-300)] rounded-lg w-24"></div>
							<div className="h-10 bg-[var(--background-200)] dark:bg-[var(--background-300)] rounded-lg w-20"></div>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-6">
					<div className="space-y-4">
						{[...Array(3)].map((_, i) => (
							<StockCardSkeleton key={i} />
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	if (watchlistError) {
		return (
			<Card className="bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm border-[var(--background-200)] dark:border-[var(--background-300)] shadow-xl">
				<CardContent className="p-6">
					<div className="text-center py-8">
						<div className="w-16 h-16 bg-[var(--accent-100)] dark:bg-[var(--accent-900)] rounded-full flex items-center justify-center mx-auto mb-4">
							<Package className="w-8 h-8 text-[var(--accent-500)] dark:text-[var(--accent-400)]" />
						</div>
						<h3 className="text-lg font-semibold text-[var(--text-700)] dark:text-[var(--text-300)] mb-2">
							Error Loading Watchlist
						</h3>
						<p className="text-[var(--text-600)] dark:text-[var(--text-400)]">
							{watchlistErrorData?.message || "Something went wrong"}
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const { Watchlist } = watchlistData;

	return (
		<Card className="bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm border-[var(--background-200)] dark:border-[var(--background-300)] shadow-xl h-full flex flex-col">
			<CardHeader className="border-b border-[var(--background-200)] dark:border-[var(--background-300)]">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-lg flex items-center justify-center shadow-md">
							<BarChart3 className="w-5 h-5 text-white" />
						</div>
						<div>
							<CardTitle className="text-xl sm:text-2xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
								Stock Portfolio
							</CardTitle>
							<p className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)] mt-1">
								Manage your watchlist stocks
							</p>
						</div>
					</div>
					
					<div className="flex items-center gap-3 w-full sm:w-auto">
						<AddStock watchlistId={watchlistId} />
						<div className="flex items-center gap-2 px-3 py-2 bg-[var(--background-200)] dark:bg-[var(--background-300)] rounded-lg border border-[var(--background-300)] dark:border-[var(--background-400)]">
							<BarChart3 className="w-4 h-4 text-[var(--primary-500)] dark:text-[var(--primary-400)]" />
							<span className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)]">
								{Watchlist.stocks?.length} Stock{Watchlist.stocks?.length !== 1 ? 's' : ''}
							</span>
						</div>
					</div>
				</div>
			</CardHeader>

			<CardContent className="flex-1 p-6">
				{Watchlist.stocks?.length > 0 ? (
					<div className="space-y-4 h-full overflow-auto scrollable-content">
						{Watchlist.stocks.map((stock) => (
							<StockCard
								key={stock._id}
								stock={stock}
								watchlistId={watchlistId}
								handlePreviewStock={handlePreviewStock}
							/>
						))}
					</div>
				) : (
					<div className="text-center py-12 h-full flex flex-col items-center justify-center">
						<div className="w-20 h-20 bg-gradient-to-br from-[var(--primary-100)] to-[var(--accent-100)] dark:from-[var(--primary-900)] dark:to-[var(--accent-900)] rounded-full flex items-center justify-center mb-6">
							<Plus className="w-10 h-10 text-[var(--primary-500)] dark:text-[var(--primary-400)]" />
						</div>
						<h3 className="text-xl font-semibold text-[var(--text-700)] dark:text-[var(--text-300)] mb-2">
							No stocks yet
						</h3>
						<p className="text-[var(--text-600)] dark:text-[var(--text-400)] text-base mb-6 max-w-sm">
							Start building your portfolio by adding your first stock to this watchlist
						</p>
						<AddStock watchlistId={watchlistId} />
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default StockList;
