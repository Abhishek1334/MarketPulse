import { useAnalyticsStore } from "@/context/AnalyticsStore";
import {
	BarChart2,
	TrendingUp,
	ArrowUp,
	ArrowDown,
	Activity,
} from "lucide-react";

const metrics = [
	{ id: "close", label: "Close", icon: TrendingUp },
	{ id: "open", label: "Open", icon: Activity },
	{ id: "high", label: "High", icon: ArrowUp },
	{ id: "low", label: "Low", icon: ArrowDown },
	{ id: "volume", label: "Volume", icon: BarChart2 },
];

const MetricSelector = () => {
	const selectedMetric = useAnalyticsStore((state) => state.selectedMetric);
	const setSelectedMetric = useAnalyticsStore(
		(state) => state.setSelectedMetric
	);

	return (
		<div className="flex items-center gap-2">
			{metrics.map(({ id, label, icon: Icon }) => (
				<button
					key={id}
					onClick={() => setSelectedMetric(id)}
					className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-200 
            ${
				selectedMetric === id
					? "bg-purple-600 text-white shadow-sm hover:bg-purple-700"
					: "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
			}
          `}
				>
					<Icon className="h-4 w-4" />
					<span>{label}</span>
				</button>
			))}
		</div>
	);
};

export default MetricSelector;
