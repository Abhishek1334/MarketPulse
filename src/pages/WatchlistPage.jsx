import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getASingleWatchlist } from "@/api/watchlist";
import { showError, showSuccess } from "@/utils/toast";
import { getStockDatafromExternalAPI } from "@/api/stock";
import WatchlistHeader from "@/components/Watchlist/WatchlistHeader";
import StockList from "@/components/Watchlist/StockList";
import StockPreviewBox from "@/components/Watchlist/StockPreviewBox";
import { StepBack } from "lucide-react";

const WatchlistPage = () => {
	const { watchlistId } = useParams();
	const [watchlistData, setWatchlistData] = useState({});
	const [loading, setLoading] = useState(true);

	const [previewStock, setPreviewStock] = useState(null);
	const [previewStockData, setPreviewStockData] = useState(null);

	const navigate = useNavigate();

	const handlePreviewStock = (stock) => {
		if (previewStock?._id === stock._id) return;
		setPreviewStock(stock);
	};

	useEffect(() => {
		if (previewStock) {
			document.body.style.overflow = "hidden";

			const fetchStockData = async () => {
				try {
					const data = await getStockDatafromExternalAPI(
						previewStock.symbol
					);
					setPreviewStockData(data);
				} catch (error) {
					console.error("Error fetching stock data:", error);
					if (error.response?.data?.message) {
						showError(error.response.data.message);
					}
				}
			};

			fetchStockData();
		} else {
			document.body.style.overflow = "auto";
			setPreviewStockData(null);
		}
	}, [previewStock]);

	useEffect(() => {
		const controller = new AbortController();
		const fetchWatchlist = async () => {
			try {
				const data = await getASingleWatchlist(watchlistId);
				if (controller.signal.aborted) return;
				if (data.error) showError(data.error);
				else {
					showSuccess(data.message);
					setWatchlistData(data.Watchlist);
				}
			} catch (error) {
				console.error("Error fetching watchlist:", error);
				showError("Failed to fetch watchlist.");
			} finally {
				setLoading(false);
			}
		};
		fetchWatchlist();
		return () => controller.abort();
	}, [watchlistId]);

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
				{/* Header */}
				<WatchlistHeader watchlistData={watchlistData} />

				{/* Stocks Section */}
				<StockList
					watchlistId={watchlistId}
					loading={loading}
					handlePreviewStock={handlePreviewStock}
				/>

				<StockPreviewBox
					previewStock={previewStock}
					previewStockData={previewStockData}
					setPreviewStock={setPreviewStock}
				/>
			</div>
		</div>
	);
};

export default WatchlistPage;
