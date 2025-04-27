import React from "react";
import moment from "moment";

const StockMarketDataPreview = ({ previewStockData }) => {
	if (!previewStockData) return null;

	const {
		price,
		change,
		changePercent,
		dayHigh,
		dayLow,
		volume,
		fiftyTwoWeekHigh,
		fiftyTwoWeekLow,
		marketCap,
		updatedAt, // assuming you have some updatedAt timestamp or fallback to current time
		marketState = "OPEN", // assuming default if not available
	} = previewStockData;

	return (
		<div className="grid grid-cols-2 gap-6">
			<div className="col-span-2 bg-[var(--background-100)] rounded-lg p-4">
				<div className="flex justify-between items-center">
					<div>
						<p className="text-sm text-[var(--text-600)]">
							Current Price
						</p>
						<p className="text-2xl font-bold text-[var(--text-900)]">
							${price?.toFixed(2)}
						</p>
					</div>
					<div
						className={`text-right ${
							change >= 0 ? "text-green-600" : "text-red-600"
						}`}
					>
						<p className="text-sm">Daily Change</p>
						<p className="text-lg font-bold">
							${change?.toFixed(2)} ({changePercent?.toFixed(2)}%)
						</p>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<div className="bg-[var(--background-100)] rounded-lg p-4">
					<p className="text-sm text-[var(--text-600)]">Day High</p>
					<p className="text-lg font-semibold text-[var(--text-900)]">
						${dayHigh?.toFixed(2)}
					</p>
				</div>
				<div className="bg-[var(--background-100)] rounded-lg p-4">
					<p className="text-sm text-[var(--text-600)]">Day Low</p>
					<p className="text-lg font-semibold text-[var(--text-900)]">
						${dayLow?.toFixed(2)}
					</p>
				</div>
			</div>

			<div className="space-y-4">
				<div className="bg-[var(--background-100)] rounded-lg p-4">
					<p className="text-sm text-[var(--text-600)]">Volume</p>
					<p className="text-lg font-semibold text-[var(--text-900)]">
						{volume?.toLocaleString()}
					</p>
				</div>
				<div className="bg-[var(--background-100)] rounded-lg p-4">
					<p className="text-sm text-[var(--text-600)]">Market Cap</p>
					<p className="text-lg font-semibold text-[var(--text-900)]">
						{marketCap
							? `$${(marketCap / 1e9).toFixed(2)}B`
							: "N/A"}
					</p>
				</div>
			</div>

			<div className="col-span-2 bg-[var(--background-100)] rounded-lg p-4">
				<div className="flex justify-between items-center">
					<div>
						<p className="text-sm text-[var(--text-600)]">
							52 Week Range
						</p>
						<p className="text-lg font-semibold text-[var(--text-900)]">
							${fiftyTwoWeekLow?.toFixed(2)} - $
							{fiftyTwoWeekHigh?.toFixed(2)}
						</p>
					</div>
					<div className="text-right">
						<p className="text-sm text-[var(--text-600)]">
							Market Status
						</p>
						<p
							className={`text-lg font-semibold ${
								marketState === "OPEN"
									? "text-green-600"
									: "text-red-600"
							}`}
						>
							{marketState === "OPEN" ? "Open" : "Closed"}
						</p>
					</div>
				</div>
			</div>

			<p className="col-span-2 text-sm text-[var(--text-500)] text-center">
				Last updated:{" "}
				{moment(updatedAt || new Date()).format("MMM D, YYYY, h:mm A")}
			</p>
		</div>
	);
};

export default StockMarketDataPreview;
