import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getASingleWatchlist } from "@/api/watchlist";
import { showError, showSuccess } from "@/utils/toast";
import { getStockDatafromExternalAPI } from "@/api/analyse";
import WatchlistHeader from "@/components/Watchlist/WatchlistHeader";
import StockList from "@/components/Watchlist/StockList";
import StockPreviewBox from "@/components/Watchlist/StockPreviewBox";
import { StepBack } from "lucide-react";
import useStore from "@/context/Store";
import { useQuery } from "@tanstack/react-query";

const WatchlistPage = () => {
	const { watchlistId } = useParams();
	const navigate = useNavigate();
	const { watchlists } = useStore();

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

	const { data: previewStockData, isFetching: previewStockLoading } =
		useQuery({
			queryKey: ["stock-preview", previewStock?.symbol],
			queryFn: () => getStockDatafromExternalAPI(previewStock.symbol),
			enabled: !!previewStock,
			onError: (error) => {
				console.error("Error fetching stock data:", error);
				if (error.response?.data?.message) {
					showError(error.response.data.message);
				}
			},
		});

	const handlePreviewStock = (stock) => {
		if (previewStock?._id === stock._id) return;
		setPreviewStock(stock);
	};

	// Scroll Lock for Preview
	if (typeof document !== "undefined") {
		document.body.style.overflow = previewStock ? "hidden" : "auto";
	}

	return (
		<div className="max-h-[90vh] px-10 py-6">
			<div
				className="font-nunito text-[var(--text-950)] hover:text-[var(--text-600)] flex items-center gap-2 mb-2 cursor-pointer w-fit"
				onClick={() => navigate("/dashboard")}
			>
				<StepBack size={26} onClick={() => window.history.back()} />
				<div>Back to Watchlists</div>
			</div>

			<div className="grid grid-cols-3 grid-rows-[auto_1fr] gap-6">
				<WatchlistHeader watchlistData={watchlistData || {}} />

				<StockList
					watchlistId={watchlistId}
					loading={isLoading}
					handlePreviewStock={handlePreviewStock}
				/>

				<StockPreviewBox
					previewStock={previewStock}
					previewStockData={previewStockData}
					setPreviewStock={setPreviewStock}
					loading={previewStockLoading}
				/>
			</div>
		</div>
	);
};

export default WatchlistPage;
