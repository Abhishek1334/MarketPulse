import { useMemo } from "react";
import { useStore } from "../store/useWatchlistsStore"; 
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	XAxis,
	YAxis,
	Bar,
	Legend,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a3e635"];

const AnalyticsPage = () => {
	const watchlists = useWatchlistsStore((state) => state.watchlists);

	const chartData = useMemo(() => {
		return watchlists.map((w) => ({
			name: w.name,
			stockCount: w.stocks.length,
		}));
	}, [watchlists]);

	const allStocks = watchlists.flatMap((w) => w.stocks);

	return (
		<div className="p-6 space-y-8">
			<h2 className="text-2xl font-bold">Analytics</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Pie Chart - Watchlist Distribution */}
				<div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow">
					<h3 className="text-xl font-semibold mb-4">
						Stocks per Watchlist
					</h3>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								dataKey="stockCount"
								data={chartData}
								cx="50%"
								cy="50%"
								outerRadius={100}
								fill="#8884d8"
								label
							>
								{chartData.map((_, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>

				{/* Bar Chart - Stock Distribution */}
				<div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow">
					<h3 className="text-xl font-semibold mb-4">
						Total Stocks by Watchlist
					</h3>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={chartData}>
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="stockCount" fill="#82ca9d" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};

export default AnalyticsPage;
