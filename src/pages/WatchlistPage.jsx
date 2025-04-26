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

	// Watchlist Query
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

	// Scroll Lock for Preview
	if (typeof document !== "undefined") {
		document.body.style.overflow = previewStock ? "hidden" : "auto";
	}

	const stocks =
			watchlistData?.stocks?.map((stock) => stock.symbol) || [];


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

	// 2. After all hooks: handle loading / error states
	if (isLoading || stockLoading) {
		return (
			<div className="flex flex-col gap-4 justify-center items-center h-[90vh] text-lg text-red-600">
				<div className="animate-spin rounded-full size-10 border-t-2 border-b-2 border-gray-600"></div>
			</div>
		);
	}

	if (isError || stockError) {
		return (
			<div className="flex flex-col gap-4 justify-center items-center h-[90vh] text-lg text-red-600">
				{error.message || "Something went wrong fetching stock data."}
				<BackButton locationAddress="" locationName="Watchlist" />
			</div>
		);
	}


	return (
		<div className="max-h-[90vh] px-10 py-6 space-y-6">
			<BackButton
				locationAddress="/dashboard"
				locationName="Dashboard"
			/>

			<div className="grid grid-cols-3 grid-rows-[auto_1fr] gap-6">
				<WatchlistHeader watchlistData={watchlistData || {}} />

				<StockList
					watchlistId={watchlistId}
					loading={isLoading}
					handlePreviewStock={handlePreviewStock}
				/>

				<StockPreviewBox
					previewStock={previewStock}
					setPreviewStock={setPreviewStock}
					stockData={stockData}
				/>
			</div>
		</div>
	);
};

export default WatchlistPage;
