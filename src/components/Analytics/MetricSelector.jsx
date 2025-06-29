import { useAnalyticsStore } from "@/context/AnalyticsStore";
import {
	BarChart2,
	TrendingUp,
	ArrowUp,
	ArrowDown,
	Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
		<div className="w-full">
			{/* Desktop Layout */}
			<div className="hidden sm:flex items-center gap-2 bg-[var(--background-200)] dark:bg-[var(--background-300)] p-1 rounded-lg border border-[var(--background-300)] dark:border-[var(--background-400)]">
				{metrics.map(({ id, label, icon: Icon }) => (
					<button
						key={id}
						onClick={() => setSelectedMetric(id)}
						className={cn(
							"flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden group flex-1 min-w-0",
							selectedMetric === id
								? "bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] text-white shadow-lg hover:from-[var(--primary-600)] hover:to-[var(--accent-600)] transform scale-105"
								: "bg-transparent text-[var(--text-700)] dark:text-[var(--text-300)] hover:bg-[var(--background-300)] dark:hover:bg-[var(--background-400)] hover:text-[var(--text-900)] dark:hover:text-[var(--text-100)]"
						)}
					>
						{/* Hover effect background */}
						<div className={cn(
							"absolute inset-0 bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] opacity-0 transition-opacity duration-300",
							selectedMetric === id ? "opacity-100" : "group-hover:opacity-10"
						)} />
						
						{/* Content */}
						<div className="relative z-10 flex items-center gap-2 w-full justify-center">
							<Icon className="h-4 w-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
							<span className="font-medium truncate">{label}</span>
						</div>
						
						{/* Active indicator */}
						{selectedMetric === id && (
							<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full animate-pulse" />
						)}
					</button>
				))}
			</div>

			{/* Mobile Layout - Horizontal Scrollable */}
			<div className="sm:hidden w-full">
				<div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
					{metrics.map(({ id, label, icon: Icon }) => (
						<button
							key={id}
							onClick={() => setSelectedMetric(id)}
							className={cn(
								"flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden group flex-shrink-0 whitespace-nowrap",
								selectedMetric === id
									? "bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] text-white shadow-lg hover:from-[var(--primary-600)] hover:to-[var(--accent-600)] transform scale-105"
									: "bg-[var(--background-200)] dark:bg-[var(--background-300)] text-[var(--text-700)] dark:text-[var(--text-300)] hover:bg-[var(--background-300)] dark:hover:bg-[var(--background-400)] hover:text-[var(--text-900)] dark:hover:text-[var(--text-100)] border border-[var(--background-300)] dark:border-[var(--background-400)]"
							)}
						>
							{/* Hover effect background */}
							<div className={cn(
								"absolute inset-0 bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] opacity-0 transition-opacity duration-300",
								selectedMetric === id ? "opacity-100" : "group-hover:opacity-10"
							)} />
							
							{/* Content */}
							<div className="relative z-10 flex items-center gap-2">
								<Icon className="h-4 w-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
								<span className="font-medium">{label}</span>
							</div>
							
							{/* Active indicator */}
							{selectedMetric === id && (
								<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full animate-pulse" />
							)}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default MetricSelector;
