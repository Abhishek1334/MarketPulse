import React from 'react'
import moment from "moment";
const StockMarketDataPreview = ({ previewStockData }) => {
	return (
		<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
			<p>
				<span className="font-medium">
					Open:
				</span>{" "}
				${previewStockData.open}
			</p>
			<p>
				<span className="font-medium">
					Close:
				</span>{" "}
				${previewStockData.close}
			</p>
			<p>
				<span className="font-medium">
					High:
				</span>{" "}
				${previewStockData.high}
			</p>
			<p>
				<span className="font-medium">
					Low:
				</span>{" "}
				${previewStockData.low}
			</p>
			<p>
				<span className="font-medium">
					Change:
				</span>{" "}
				<span
					className={
						Number(
							previewStockData.change
						) >= 0
							? "text-green-600"
							: "text-red-600"
					}
				>
					${previewStockData.change} (
					{
						previewStockData.percent_change
					}
					%)
				</span>
			</p>
			<p>
				<span className="font-medium">
					Volume:
				</span>{" "}
				{Number(
					previewStockData.volume
				).toLocaleString()}
			</p>
			<p>
				<span className="font-medium">
					52W Range:
				</span>{" "}
				{
					previewStockData.fifty_two_week
						?.range
				}
			</p>
			<p>
				<span className="font-medium">
					Market:
				</span>{" "}
				{previewStockData.is_market_open
					? "Open"
					: "Closed"}
			</p>
			<p className="col-span-2">
				<span className="font-medium">
					Last Quote:
				</span>{" "}
				{moment
					.unix(
						previewStockData.last_quote_at
					)
					.format("MMM D, YYYY, h:mm A")}
			</p>
		</div>
	)
}

export default StockMarketDataPreview