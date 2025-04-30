import React from "react";
import clsx from "clsx";
import { useAnalyticsStore } from "@/context/AnalyticsStore";

const TimeframePicker = () => {
	const { timeframe, setTimeframe } = useAnalyticsStore();

	const handleChange = (newTimeframe) => (e) => {
		e.preventDefault();
		setTimeframe(newTimeframe);
	};

	return (
		<div className="flex gap-2 max-sm:overflow-x-auto scrollbar-hide max-w-full pb-2">
			{["1D", "1W", "1M"].map((tf) => (
				<button
					key={tf}
					type="button"
					onClick={handleChange(tf)}
					className={clsx(/* ... */)}
				>
					{tf}
				</button>
			))}
		</div>
	);
};
export default TimeframePicker;
