import React from "react";
import moment from "moment";

const StockPreview = ({ previewStock }) => {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-3xl font-bold text-[var(--text-900)]">
						{previewStock.symbol}
					</h3>
					<p className="text-[var(--text-600)] mt-1">
						Added{" "}
						{moment(previewStock.addedAt).format("MMM D, YYYY")}
					</p>
				</div>
				{previewStock.targetPrice && (
					<div className="bg-[var(--primary-100)] px-4 py-2 rounded-lg">
						<p className="text-sm text-[var(--primary-600)]">
							Target Price
						</p>
						<p className="text-xl font-bold text-[var(--primary-800)]">
							${previewStock.targetPrice}
						</p>
					</div>
				)}
			</div>

			{previewStock.note && (
				<div className="bg-[var(--background-100)] rounded-lg p-4">
					<p className="text-sm font-medium text-[var(--text-600)]">
						Note
					</p>
					<p className="text-[var(--text-900)] mt-1">
						{previewStock.note}
					</p>
				</div>
			)}
		</div>
	);
};

export default StockPreview;
