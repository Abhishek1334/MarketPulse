import React from 'react'
import { Info, TrendingUp, Target, FileText, Calendar } from "lucide-react";

const StockDetailsCard = ({ stock }) => {
	

	return (
		
		<div className="bg-[var(--background-50)] rounded-xl shadow-sm p-6">
			<h2 className="text-lg font-semibold text-[var(--text-950)] mb-4 flex items-center">
				<Info className="h-5 w-5 mr-2 text-indigo-600" />
				Stock Information
			</h2>
			{stock && (
				<div className="space-y-4 font-medium">
					<div className="flex items-center text-[var(--text-950)]">
						<TrendingUp className="h-5 w-5 mr-3 text-indigo-600" />
						<div>
							<p className="text-sm text-gray-500">Symbol</p>
							<p className="font-medium text-[var(--text-950)]">
								{stock.symbol}
							</p>
						</div>
					</div>
					<div className="flex items-center text-gray-600">
						<Target className="h-5 w-5 mr-3 text-indigo-600" />
						<div>
							<p className="text-sm text-gray-500">
								Target Price
							</p>
							<p className="font-medium text-[var(--text-950)]">
								${stock.targetPrice || " ---"}
							</p>
						</div>
					</div>
					<div className="flex items-center text-gray-600">
						<FileText className="h-5 w-5 mr-3 text-indigo-600" />
						<div>
							<p className="text-sm text-gray-500">Note</p>
							<p className="font-medium text-[var(--text-950)]">
								{stock.note || "No notes added"}
							</p>
						</div>
					</div>
					<div className="flex items-center text-gray-600">
						<Calendar className="h-5 w-5 mr-3 text-indigo-600" />
						<div>
							<p className="text-sm text-gray-500">
								Added Date
							</p>
							<p className="font-medium text-[var(--text-950)]">
								{new Date(
									stock.addedAt
								).toLocaleDateString()}
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default StockDetailsCard