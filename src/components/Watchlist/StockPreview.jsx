import React from 'react'
import moment from "moment";
const StockPreview = ({ previewStock }) => {
	return (
		<div className="space-y-1 border-b-2 pb-4">
			<h2 className="text-xl font-semibold text-[var(--text-950)] pb-2">
				Stock Preview
			</h2>
			<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
				<p>
					<span className="font-medium">
						Symbol:
					</span>{" "}
					{previewStock.symbol}
				</p>
				<p>
					<span className="font-medium">
						Target Price:
					</span>{" "}
					${previewStock.targetPrice}
				</p>
				<p>
					<span className="font-medium">
						Note:
					</span>{" "}
					{previewStock.note || "—"}
				</p>
				<p>
					<span className="font-medium">
						Added:
					</span>{" "}
					{moment(previewStock.addedAt).format(
						"MMM D, YYYY"
					)}
				</p>
			</div>
		</div>
	)
}

export default StockPreview