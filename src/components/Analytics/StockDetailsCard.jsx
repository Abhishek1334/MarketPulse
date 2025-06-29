import React from 'react'
import { Info, TrendingUp, Target, FileText, Calendar } from "lucide-react";

const StockDetailsCard = ({ stock }) => {
	

	return (
		
		<div className="bg-[var(--background-50)] dark:bg-[var(--background-200)] rounded-xl shadow-sm p-6">
			<h2 className="text-lg font-semibold text-[var(--text-950)] dark:text-[var(--text-50)] mb-4 flex items-center">
				<Info className="h-5 w-5 mr-2 text-indigo-600" />
				Stock Information
			</h2>
			{stock && (
				<div className="space-y-4">
						<div>
						<p className="text-sm text-[var(--text-500)] dark:text-[var(--text-300)]">Symbol</p>
						<p className="text-lg font-semibold text-[var(--text-950)] dark:text-[var(--text-50)]">{stock.symbol}</p>
					</div>
						<div>
						<div className="flex items-center text-[var(--text-600)]">
							<span className="text-2xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)]">{stock.price}</span>
							<span className={`ml-2 text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
								{stock.change >= 0 ? '+' : ''}{stock.change}%
							</span>
						</div>
						<p className="text-sm text-[var(--text-500)] dark:text-[var(--text-300)]">{stock.change >= 0 ? 'Gain' : 'Loss'} today</p>
					</div>
						<div>
						<div className="flex items-center text-[var(--text-600)]">
							<span className="text-lg font-semibold text-[var(--text-950)] dark:text-[var(--text-50)]">{stock.volume}</span>
						</div>
						<p className="text-sm text-[var(--text-500)] dark:text-[var(--text-300)]">Note</p>
					</div>
						<div>
						<div className="flex items-center text-[var(--text-600)]">
							<span className="text-lg font-semibold text-[var(--text-950)] dark:text-[var(--text-50)]">${stock.marketCap}</span>
						</div>
						<p className="text-sm text-[var(--text-500)] dark:text-[var(--text-300)]">Market Cap</p>
					</div>
				</div>
			)}
		</div>
	);
}

export default StockDetailsCard