import React from "react";
const timeframes = ["1D", "1W", "1M"];
import { useAnalyticsStore } from "@/context/AnalyticsStore";

const TimeframePicker = () => {
	const { timeframe: selectedTimeframe, setTimeframe } = useAnalyticsStore();

	const handleButtonClick = (timeframe, event) => {
		event.preventDefault(); // Prevent form or default behavior
		setTimeframe(timeframe);
	};

	return (
		<div className="flex gap-2 max-sm:overflow-x-auto scrollbar-hide max-w-full pb-2 ">
			{timeframes.map((timeframe) => (
				<button
					key={timeframe}
					type="button" // This prevents the page reload
					onClick={(e) => handleButtonClick(timeframe, e)} // Pass event to prevent default behavior
					className={`px-3 py-1.5 whitespace-nowrap rounded-lg text-sm font-medium transition-colors
									${
										selectedTimeframe === timeframe
											? "bg-indigo-600 text-white"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200"
									}`}
				>
					{timeframe}
				</button>
			))}
		</div>
	);
};

export default TimeframePicker;
