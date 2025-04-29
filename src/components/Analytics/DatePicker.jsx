import React from "react";

const DatePicker = ({
	startDate,
	setStartDate,
	endDate,
	setEndDate,
	handleConfirmDateChange,
}) => {
	return (
		<div className="flex flex-wrap gap-4 items-center">
			<label className="text-sm font-medium text-[var(--text-700)]">
				Start Date:
				<input
					type="date"
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
					className="ml-2 px-2 py-1 border bg-[var(--background-50)] border-gray-300 rounded-md text-[var(--text-950)]"
				/>
			</label>
			<label className="text-sm font-medium text-[var(--text-700)]">
				End Date:
				<input
					type="date"
					value={endDate}
					onChange={(e) => setEndDate(e.target.value)}
					className="ml-2 px-2 py-1 border border-gray-300 rounded-md
											bg-[var(--background-50)] text-[var(--text-950)] "
				/>
			</label>
			{/* Confirm Button */}
			<button
				onClick={handleConfirmDateChange}
				className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
			>
				Confirm Date Change
			</button>
		</div>
	);
};

export default DatePicker;
