import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getASingleWatchlist } from "@/api/watchlist";
import { showError, showSuccess } from "@/utils/toast";
import moment from "moment";
import { getStockDatafromExternalAPI } from "@/api/stock";
import WatchlistHeader from "@/components/Watchlist/WatchlistHeader";
import StockList from "@/components/Watchlist/StockList";
import StockPreviewBox from "@/components/Watchlist/StockPreviewBox";

const WatchlistPage = () => {
	const { watchlistId } = useParams();
	const [watchlistData, setWatchlistData] = useState({});
	const [loading, setLoading] = useState(true);

	const [previewStock, setPreviewStock] = useState(null);
	const [previewStockData, setPreviewStockData] = useState(null);

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
		<div className="min-h-screen p-15">
			<div className="grid grid-cols-3 grid-rows-[auto_1fr] gap-6">
				{/* Header */}
				<WatchlistHeader watchlistData={watchlistData} />

				{/* Stocks Section */}
				<StockList
					watchlistData={watchlistData}
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
