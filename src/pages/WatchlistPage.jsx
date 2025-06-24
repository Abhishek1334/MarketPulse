import { useState } from "react";
import { useParams } from "react-router-dom";
import { getASingleWatchlist } from "@/api/watchlist";
import { showError, showSuccess } from "@/utils/toast";
import WatchlistHeader from "@/components/Watchlist/WatchlistHeader";
import StockList from "@/components/Watchlist/StockList";
import StockPreviewBox from "@/components/Watchlist/StockPreviewBox";
import { useQuery } from "@tanstack/react-query";
import BackButton from "@/components/BackButton";
import { getStockDataforWatchlist } from "@/api/analyse";
import { ChevronUp, ChevronDown } from "lucide-react";

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
			<div className="flex flex-col gap-4 justify-center items-center h-[calc(100vh-4rem)] text-[var(--text-600)] px-4">
				<div className="animate-spin rounded-full w-8 h-8 sm:w-10 sm:h-10 border-t-2 border-b-2 border-[var(--primary-600)]"></div>
				<p className="text-base sm:text-lg font-medium text-center">Loading watchlist...</p>
			</div>
		);
	}

	if (isError || stockError) {
		return (
			<div className="flex flex-col gap-4 justify-center items-center h-[calc(100vh-4rem)] text-base sm:text-lg text-[var(--accent-600)] px-4">
				<p className="text-center">{error?.message || "Something went wrong fetching stock data."}</p>
				<BackButton locationAddress="" locationName="Watchlist" />
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen bg-[var(--background-50)]">
			{/* Header */}
			<div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
				<BackButton
					locationAddress="/dashboard"
					locationName="Dashboard"
					className="text-[var(--text-600)] hover:text-[var(--text-800)] transition-colors mb-4"
				/>
				<WatchlistHeader watchlistData={watchlistData || {}} />
			</div>

			{/* Main Content */}
			<div className="flex-1 px-4 sm:px-6 lg:px-10 pb-4 sm:pb-6">
				{/* Desktop Layout */}
				<div className="hidden lg:flex gap-6 h-full">
					<div className="flex-1 min-w-0">
						<StockList
							watchlistId={watchlistId}
							loading={isLoading}
							handlePreviewStock={handlePreviewStock}
						/>
					</div>
					<div className="w-80 xl:w-96 flex-shrink-0">
						<StockPreviewBox
							previewStock={previewStock}
							setPreviewStock={setPreviewStock}
							stockData={stockData}
						/>
					</div>
				</div>

				{/* Mobile Layout */}
				<div className="lg:hidden flex flex-col gap-4 h-full">
					<div className="flex-1 min-h-0">
						<StockList
							watchlistId={watchlistId}
							loading={isLoading}
							handlePreviewStock={handlePreviewStock}
						/>
					</div>

					{/* Mobile Preview Panel */}
					{previewStock && (
						<div className="relative">
							<button
								onClick={() => setIsPreviewOpen(!isPreviewOpen)}
								className="w-full bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white py-3 px-4 rounded-lg flex items-center justify-between transition-colors"
							>
								<span className="font-medium">
									{previewStock.symbol} Details
								</span>
								{isPreviewOpen ? (
									<ChevronDown className="w-5 h-5" />
								) : (
									<ChevronUp className="w-5 h-5" />
								)}
							</button>
							
							{isPreviewOpen && (
								<div className="mt-2 animate-in slide-in-from-bottom-2 duration-200">
									<StockPreviewBox
										previewStock={previewStock}
										setPreviewStock={setPreviewStock}
										stockData={stockData}
										isMobile={true}
									/>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default WatchlistPage;
