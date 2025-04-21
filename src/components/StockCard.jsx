import React from "react";
import moment from "moment";


const StockCard = ({ stock, handlePreviewStock }) => {
	return (
		<div className="bg-[var(--secondary-50)] rounded-xl shadow-sm p-4 grid grid-cols-4 gap-4 text-[var(--text-950)] items-center" 
			onClick={() => handlePreviewStock(stock)}>
			<div>
				<p className="font-semibold text-lg">{stock.symbol}</p>
				<p className="text-xs text-[var(--text-600)]">
					Added: {moment(stock.addedAt).format("MMM D, YYYY")}
				</p>
			</div>

			<div>
				<p className="text-sm font-medium text-var(--text-600)">
					Target Price
				</p>
				<p className="text-lg font-bold text-blue-300">
					${stock.targetPrice}
				</p>
			</div>

			<div className="col-span-2">
				<p className="text-sm font-medium text-var(--text-600)">Note</p>
				<p className="text-base">{stock.note}</p>
			</div>
		</div>
	);
};

export default StockCard;
