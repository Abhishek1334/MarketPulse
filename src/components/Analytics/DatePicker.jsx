// DatePicker.jsx
import React, { useState, useEffect } from "react";
import { useAnalyticsStore } from "@/context/AnalyticsStore";

const DatePicker = () => {
	const { startDate, endDate, setStartDate, setEndDate } =
		useAnalyticsStore();
	const [localStart, setLocalStart] = useState(startDate);
	const [localEnd, setLocalEnd] = useState(endDate);

	useEffect(() => {
		const timer = setTimeout(() => {
			const newStart = new Date(localStart);
			const newEnd = new Date(localEnd);

			if (newStart > new Date()) newStart = new Date();
			if (newEnd > new Date()) newEnd = new Date();
			if (newStart > newEnd) return;

			setStartDate(newStart.toISOString().split("T")[0]);
			setEndDate(newEnd.toISOString().split("T")[0]);
		}, 500);

		return () => clearTimeout(timer);
	}, [localStart, localEnd]);

	return (
		<div className="flex flex-wrap gap-4 items-center">
			<label>
				Start Date:
				<input
					type="date"
					value={localStart}
					onChange={(e) => setLocalStart(e.target.value)}
				/>
			</label>
			<label>
				End Date:
				<input
					type="date"
					value={localEnd}
					onChange={(e) => setLocalEnd(e.target.value)}
				/>
			</label>
		</div>
	);
};

export default DatePicker;