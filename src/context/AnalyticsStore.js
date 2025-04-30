// useAnalyticsStore.js
import { create } from "zustand";

const getInitialDates = () => {
	const today = new Date();
	const thirtyDaysAgo = new Date(today);
	thirtyDaysAgo.setDate(today.getDate() - 30);
	return {
		startDate: thirtyDaysAgo.toISOString().split("T")[0],
		endDate: today.toISOString().split("T")[0],
	};
};

export const useAnalyticsStore = create((set) => ({
	SearchStock: "",
	timeframe: "1D",
	metric: "close",
	...getInitialDates(),

	setSearchStock: (stock) => set({ SearchStock: stock }),
	setTimeframe: (timeframe) => set({ timeframe }),
	setMetric: (metric) => set({ metric }),
	setStartDate: (date) => set({ startDate: date }),
	setEndDate: (date) => set({ endDate: date }),
}));
