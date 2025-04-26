import React from 'react'
import { Clock } from "lucide-react";
const MarketHoursCard = () => {
	return (
		<div className="bg-[var(--background-50)] rounded-xl shadow-sm p-6">
			<h2 className="text-lg font-semibold text-[var(--text-950)] mb-4 flex items-center">
				<Clock className="h-5 w-5 mr-2 text-indigo-600" />
				Market Hours
			</h2>
			<div className="space-y-3">
				<div className="flex justify-between items-center">
					<span className="text-[var(--text-700)]">Pre-Market</span>
					<span className="text-[var(--text-950)]">
						4:00 AM - 9:30 AM
					</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-[var(--text-700)]">
						Regular Hours
					</span>
					<span className="text-[var(--text-950)]">
						9:30 AM - 4:00 PM
					</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-[var(--text-700)]">After Hours</span>
					<span className="text-[var(--text-950)]">
						4:00 PM - 8:00 PM
					</span>
				</div>
			</div>
		</div>
	);	
}

export default MarketHoursCard