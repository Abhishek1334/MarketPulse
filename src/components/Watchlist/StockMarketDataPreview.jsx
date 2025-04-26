import React from "react";
import moment from "moment";

const StockMarketDataPreview = ({ previewStockData }) => {
	if (!previewStockData) return null;

	const {
		regularMarketOpen,
		regularMarketPrice,
		regularMarketDayHigh,
		regularMarketDayLow,
		regularMarketChange,
		regularMarketChangePercent,
		regularMarketVolume,
		fiftyTwoWeekRange,
		marketState,
		regularMarketTime,
	} = previewStockData;

	return (
		<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
			<p>
				<span className="font-medium">Open:</span> $
				{regularMarketOpen?.toFixed(2)}
			</p>
			<p>
				<span className="font-medium">Close:</span> $
				{regularMarketPrice?.toFixed(2)}
			</p>
			<p>
				<span className="font-medium">High:</span> $
				{regularMarketDayHigh?.toFixed(2)}
			</p>
			<p>
				<span className="font-medium">Low:</span> $
				{regularMarketDayLow?.toFixed(2)}
			</p>
			<p>
				<span className="font-medium">Change:</span>{" "}
				<span
					className={
						regularMarketChange >= 0
							? "text-green-600"
							: "text-red-600"
					}
				>
					${regularMarketChange?.toFixed(2)} (
					{regularMarketChangePercent?.toFixed(2)}%)
				</span>
			</p>
			<p>
				<span className="font-medium">Volume:</span>{" "}
				{regularMarketVolume?.toLocaleString()}
			</p>
			<p>
				<span className="font-medium">52W Range:</span>{" "}
				{fiftyTwoWeekRange
					? `${fiftyTwoWeekRange.low} - ${fiftyTwoWeekRange.high}`
					: "N/A"}
			</p>
			<p>
				<span className="font-medium">Market:</span>{" "}
				{marketState === "OPEN" ? "Open" : "Closed"}
			</p>
			<p className="col-span-2">
				<span className="font-medium">Last Quote:</span>{" "}
				{regularMarketTime
					? moment(regularMarketTime).format("MMM D, YYYY, h:mm A")
					: "N/A"}
			</p>
		</div>
	);
};

export default StockMarketDataPreview;
