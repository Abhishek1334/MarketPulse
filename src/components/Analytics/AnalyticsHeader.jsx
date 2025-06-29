import React from 'react'
const AnalyticsHeader = ({ symbol, exchange, latest, priceChange, isUp }) => {
	return (
			<>
				<div>
					<h1 className="text-2xl md:text-3xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)]">
						{symbol}{" "}
						<span className="font-semibold text-xl ml-2">
							Analytics
						</span>
					</h1>
					<p className="text-sm font-medium text-[var(--text-600)] dark:text-[var(--text-300)] mt-1">
						Real-time market analysis and insights
					</p>
				</div>

				<div className="max-md:hidden flex justify-start w-1/2 m-10 items-center gap-10">
					<p className="text-lg font-semibold text-[var(--text-950)] dark:text-[var(--text-50)] flex items-center gap-1">
						{latest?.toFixed(2)}
						{priceChange ? (
							<span
								className={`ml-2 text-sm ${
									isUp ? "text-green-500" : "text-red-500"
								}`}
							>
								{isUp ? "▲" : "▼"} {priceChange.toFixed(2)}%
							</span>
						) : null}
					</p>

					<div className="flex flex-col gap-2 text-sm font-medium ">
						<h1 className="font-semibold text-lg text-[var(--text-600)] dark:text-[var(--text-300)]">
							Exchange
						</h1>
						<p className="text-[var(--text-950)] dark:text-[var(--text-50)]">
							{exchange}
						</p>
					</div>
				</div>
			</>
	);
}

export default AnalyticsHeader