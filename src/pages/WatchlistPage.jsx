import { useState } from "react";
import { useParams } from "react-router-dom";
import { getASingleWatchlist } from "@/api/watchlist";
import { showError, showSuccess } from "@/utils/toast.jsx";
import WatchlistHeader from "@/components/Watchlist/WatchlistHeader";
import StockList from "@/components/Watchlist/StockList";
import StockPreviewBox from "@/components/Watchlist/StockPreviewBox";
import { useQuery } from "@tanstack/react-query";
import BackButton from "@/components/BackButton";
import { getStockDataforWatchlist } from "@/api/analyse";
import { ChevronUp, ChevronDown, Loader2, AlertCircle, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WatchlistPage = () => {
	const { watchlistId } = useParams();
	const [previewStock, setPreviewStock] = useState(null);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);

	const {
		data: watchlistData,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["watchlist", watchlistId],
		queryFn: () => getASingleWatchlist(watchlistId),
		onSuccess: (data) => {
			if (data?.error) showError(data.error);
			else showSuccess(data.message);
		},
		onError: () => {
			showError("Failed to fetch watchlist.");
		},
		select: (data) => data?.Watchlist,
	});

	const handlePreviewStock = (stock) => {
		if (previewStock?._id === stock._id) {
			// On mobile, toggle preview panel
			if (window.innerWidth < 1024) {
				setIsPreviewOpen(!isPreviewOpen);
			}
			return;
		}
		setPreviewStock(stock);
		// On mobile, automatically open preview
		if (window.innerWidth < 1024) {
			setIsPreviewOpen(true);
		}
	};

	const stocks = watchlistData?.stocks?.map((stock) => stock.symbol) || [];

	const {
		data: stockData,
		isLoading: stockLoading,
		isError: stockError,
		error: stockErrorData,
	} = useQuery({
		queryKey: ["watchlist-stocks", stocks],
		queryFn: () => getStockDataforWatchlist(stocks),
		enabled: stocks.length > 0,
	});

	if (isLoading || stockLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-[var(--background-50)] to-[var(--background-100)] dark:from-[var(--background-50)] dark:to-[var(--background-100)] flex items-center justify-center">
				<Card className="bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm border-[var(--background-200)] dark:border-[var(--background-300)] shadow-xl p-8">
					<CardContent className="flex flex-col items-center gap-4">
						<Loader2 className="h-8 w-8 animate-spin text-[var(--primary-500)] dark:text-[var(--primary-400)]" />
						<p className="text-lg font-medium text-[var(--text-700)] dark:text-[var(--text-300)]">Loading watchlist...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (isError || stockError) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-[var(--background-50)] to-[var(--background-100)] dark:from-[var(--background-50)] dark:to-[var(--background-100)] flex items-center justify-center p-4">
				<Card className="bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm border-[var(--background-200)] dark:border-[var(--background-300)] shadow-xl p-8 max-w-md">
					<CardContent className="flex flex-col items-center gap-4 text-center">
						<AlertCircle className="h-12 w-12 text-[var(--accent-500)] dark:text-[var(--accent-400)]" />
						<p className="text-lg font-medium text-[var(--text-700)] dark:text-[var(--text-300)]">
							{error?.message || "Something went wrong fetching stock data."}
						</p>
						<BackButton locationAddress="/dashboard" locationName="Dashboard" />
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[var(--background-50)] to-[var(--background-100)] dark:from-[var(--background-50)] dark:to-[var(--background-100)]">
			<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
				{/* Header Section */}
				<div className="mb-8">
					<BackButton
						locationAddress="/dashboard"
						locationName="Dashboard"
						className="text-[var(--text-600)] dark:text-[var(--text-400)] hover:text-[var(--text-800)] dark:hover:text-[var(--text-200)] transition-colors mb-6"
					/>
					<WatchlistHeader watchlistData={watchlistData || {}} />
				</div>

				{/* Mobile Help Note - Only visible on small screens */}
				<div className="lg:hidden mb-4">
					<Card className="bg-gradient-to-r from-[var(--primary-50)] to-[var(--accent-50)] dark:from-[var(--primary-900)]/20 dark:to-[var(--accent-900)]/20 border-[var(--primary-200)] dark:border-[var(--primary-800)] shadow-sm">
						<CardContent className="p-3">
							<div className="flex items-center gap-2">
								<Info className="w-4 h-4 text-[var(--primary-600)] dark:text-[var(--primary-400)] flex-shrink-0" />
								<p className="text-sm text-[var(--primary-700)] dark:text-[var(--primary-300)] font-medium">
									💡 Tap on any stock to view detailed information at the bottom of the page
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
					{/* Stock List - Takes 3 columns on desktop */}
					<div className="lg:col-span-3">
						<StockList
							watchlistId={watchlistId}
							loading={isLoading}
							handlePreviewStock={handlePreviewStock}
						/>
					</div>

					{/* Stock Preview - Takes 1 column on desktop */}
					<div className="lg:col-span-1">
						{/* Desktop Preview */}
						<div className="hidden lg:block">
							<StockPreviewBox
								previewStock={previewStock}
								setPreviewStock={setPreviewStock}
								stockData={stockData}
							/>
						</div>

						{/* Mobile Preview */}
						<div className="lg:hidden">
							{previewStock && (
								<Card className="bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm border-[var(--background-200)] dark:border-[var(--background-300)] shadow-lg">
									<CardContent className="p-0">
										<button
											onClick={() => setIsPreviewOpen(!isPreviewOpen)}
											className="w-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] hover:from-[var(--primary-600)] hover:to-[var(--accent-600)] text-white py-4 px-6 rounded-t-lg flex items-center justify-between transition-all duration-200 shadow-lg"
										>
											<span className="font-semibold text-lg">
												{previewStock.symbol} Details
											</span>
											{isPreviewOpen ? (
												<ChevronDown className="w-5 h-5 transition-transform duration-200" />
											) : (
												<ChevronUp className="w-5 h-5 transition-transform duration-200" />
											)}
										</button>
										
										{isPreviewOpen && (
											<div className="animate-in slide-in-from-bottom-2 duration-300">
												<StockPreviewBox
													previewStock={previewStock}
													setPreviewStock={setPreviewStock}
													stockData={stockData}
													isMobile={true}
												/>
											</div>
										)}
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WatchlistPage;
