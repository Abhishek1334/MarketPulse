import { create } from "zustand";

export const useAnalyticsStore = create((set) => {
	const today = new Date();
	const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

	return {
		SearchStock: "",
		setSearchStock: (stock) => set({ SearchStock: stock }),
		timeframe: "1D",
		metric: "close",
		startDate: thirtyDaysAgo.toISOString().split("T")[0],
		endDate: today.toISOString().split("T")[0],
		setTimeframe: (timeframe) => set({ timeframe }),
		setMetric: (metric) => set({ metric }),
		setStartDate: (date) => set({ startDate: date }),
		setEndDate: (date) => set({ endDate: date }),
	};
});
