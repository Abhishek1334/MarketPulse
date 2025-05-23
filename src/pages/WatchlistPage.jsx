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

const WatchlistPage = () => {
	const { watchlistId } = useParams();
	const [previewStock, setPreviewStock] = useState(null);

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
		if (previewStock?._id === stock._id) return;
		setPreviewStock(stock);
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
			<div className="flex flex-col gap-4 justify-center items-center h-[calc(100vh-4rem)] text-[var(--text-600)]">
				<div className="animate-spin rounded-full size-10 border-t-2 border-b-2 border-[var(--primary-600)]"></div>
				<p className="text-lg font-medium">Loading watchlist...</p>
			</div>
		);
	}

	if (isError || stockError) {
		return (
			<div className="flex flex-col gap-4 justify-center items-center h-[calc(100vh-4rem)] text-lg text-[var(--accent-600)]">
				{error.message || "Something went wrong fetching stock data."}
				<BackButton locationAddress="" locationName="Watchlist" />
			</div>
		);
	}

	return (
		<div className="flex flex-col h-[calc(100vh-1rem)] bg-[var(--background-50)] px-6 md:px-10 py-6 gap-4">
			<BackButton
				locationAddress="/dashboard"
				locationName="Dashboard"
				className="text-[var(--text-600)] hover:text-[var(--text-800)] transition-colors mb-4"
			/>

			<div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
				{" "}
				{/* Changed to flex-col on smaller screens */}
				{/* Watchlist Header */}
				<div className="lg:col-span-3 mb-4">
					<WatchlistHeader watchlistData={watchlistData || {}} />
				</div>
				{/* Stock List and Stock Preview Box */}
				<div className="lg:col-span-3 lg:flex lg:gap-8 overflow-hidden">
					{" "}
					{/* Use flex on larger screens */}
					{/* Stock List */}
					<div
						className="lg:flex-1 overflow-auto"
						style={{ minHeight: "300px" }}
					>
						{" "}
						{/* Removed max-h, added min-height */}
						<StockList
							watchlistId={watchlistId}
							loading={isLoading}
							handlePreviewStock={handlePreviewStock}
						/>
					</div>
					{/* Stock Preview Box */}
					<div className="lg:w-[300px] flex-shrink-0 overflow-auto">
						{" "}
						{/* Fixed width for preview on larger screens */}
						<StockPreviewBox
							previewStock={previewStock}
							setPreviewStock={setPreviewStock}
							stockData={stockData}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WatchlistPage;
