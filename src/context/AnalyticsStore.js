// useAnalyticsStore.js
import { create } from "zustand";

export const useAnalyticsStore = create((set) => ({
	SearchStock: "",
	setSearchStock: (stock) => set({ SearchStock: stock }),

	stockData: [],
	setStockData: (data) => {
		console.log("Data in setStockData:", data);
		set({ stockData: data });
	},

	selectedMetric: "close",
	setSelectedMetric: (metric) => set({ selectedMetric: metric }),

	// Default values for period1 (start date) and period2 (end date)
	period1: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // default to 1 year ago
	period2: new Date(), // default to today

	setPeriod: (start, end = new Date()) =>
		set({ period1: start, period2: end }),

	selectedInterval: "1d", // default interval
	setSelectedInterval: (interval) => set({ selectedInterval: interval }),
}));
