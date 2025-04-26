import React from 'react'

const MetricSelector = ({ selectedMetric, handleMetricChange, metrics }) => {
	return (
		<select
			value={selectedMetric}
			onChange={(e) => handleMetricChange(e.target.value)}
			className="px-4 py-2 border border-gray-200 rounded-lg bg-[var(--background-50)] text-[var(--text-950)] focus:outline-none focus:ring-1 focus:ring-indigo-500"
		>
			{metrics.map((metric) => (
				<option key={metric} value={metric}>
					{metric.toUpperCase()}
				</option>
			))}
		</select>
	);
}

export default MetricSelector