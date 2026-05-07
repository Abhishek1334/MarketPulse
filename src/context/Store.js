import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	fetchPortfolio,
	apiAddHolding,
	apiUpdateHolding,
	apiDeleteHolding,
	apiAddTransaction,
	apiUpdatePortfolioSettings,
	apiImportPortfolio,
	fetchBatchQuotes,
} from "@/api/portfolio";

const normalizeHoldings = (arr = []) =>
	arr.map((h) => ({ ...(h.toObject ? h.toObject() : h), id: h.id || h._id }));
const normalizeTransactions = (arr = []) =>
	arr.map((t) => ({ ...(t.toObject ? t.toObject() : t), id: t.id || t._id }));

const useStore = create(
	persist(
		(set, get) => ({
			// ---- Auth State ----
			user: null,

			login: ({ user, token }) => {
				const userWithToken = { ...user, token };
				set({ user: userWithToken });
			},

			logout: () => {
				set({ user: null });
			},
			isLoggedIn: () => !!get().user,

			// ---- Watchlists State ----
			watchlists: [],

			// Replace all watchlists (e.g., after fetching from API)
			setWatchlists: (watchlists) => set({ watchlists }),

			addWatchlist: (newWatchlist) =>
				set((state) => ({
					watchlists: [...state.watchlists, newWatchlist],
				})),

			deleteWatchlist: (id) =>
				set((state) => ({
					watchlists: state.watchlists.filter((w) => w._id !== id),
				})),

			addStockToWatchlist: (watchlistId, stock) =>
				set((state) => ({
					watchlists: state.watchlists.map((watchlist) =>
						watchlist._id === watchlistId
							? {
									...watchlist,
									stocks: [...watchlist.stocks, stock],
							}
							: watchlist
					),
				})),

			updateStockInWatchlist: (watchlistId, stockSymbol, updatedStock) =>
				set((state) => ({
					watchlists: state.watchlists.map((watchlist) =>
						watchlist._id === watchlistId
							? {
									...watchlist,
									stocks: watchlist.stocks.map((stock) =>
										stock.symbol === stockSymbol
											? { ...stock, ...updatedStock }
											: stock
									),
							}
							: watchlist
					),
				})),

			removeStockFromWatchlist: (watchlistId, stockSymbol) =>
				set((state) => ({
					watchlists: state.watchlists.map((watchlist) =>
						watchlist._id === watchlistId
							? {
									...watchlist,
									stocks: watchlist.stocks.filter(
										(stock) => stock.symbol !== stockSymbol
									),
							}
							: watchlist
					),
				})),

			// ---- Portfolio State ----
			portfolio: {
				holdings: [],
				transactions: [],
				performance: {
					totalValue: 0,
					totalCost: 0,
					totalGain: 0,
					totalGainPercent: 0,
					dailyChange: 0,
					dailyChangePercent: 0,
					allTimeHigh: 0,
					allTimeLow: 0,
					beta: 0,
					sharpeRatio: 0,
					maxDrawdown: 0
				},
				settings: {
					currency: 'USD',
					showUnrealizedGains: true,
					includeDividends: true,
					taxRate: 0.15,
					rebalanceThreshold: 0.05
				}
			},

			// Portfolio Actions
			addHolding: async (holding) => {
				await apiAddHolding({
					symbol: holding.symbol,
					shares: holding.shares,
					averagePrice: holding.averagePrice,
					purchaseDate: holding.purchaseDate,
					notes: holding.notes,
					sector: holding.sector,
				});
				// Refetch through loadPortfolio so the new holding gets a current
				// price merged in. Using the API response directly leaves
				// currentPrice undefined and the totals fall back to averagePrice.
				await get().loadPortfolio();
			},

			updateHolding: async (holdingId, updates) => {
				await apiUpdateHolding(holdingId, updates);
				await get().loadPortfolio();
			},

			removeHolding: async (holdingId) => {
				await apiDeleteHolding(holdingId);
				await get().loadPortfolio();
			},

			addTransaction: async (transaction) => {
				await apiAddTransaction(transaction);
				await get().loadPortfolio();
			},

			updatePortfolioPerformance: (performance) =>
				set((state) => ({
					portfolio: {
						...state.portfolio,
						performance: { ...state.portfolio.performance, ...performance }
					}
				})),

			updatePortfolioSettings: async (settings) => {
				const data = await apiUpdatePortfolioSettings(settings);
				set((state) => ({
					portfolio: { ...state.portfolio, settings: data.settings },
				}));
			},

			// Portfolio Calculations
			calculatePortfolioMetrics: () => {
				const state = get();
				const { holdings, transactions } = state.portfolio;

				let totalValue = 0;
				let totalCost = 0;
				let totalGain = 0;
				let totalGainPercent = 0;

				// Calculate current holdings
				holdings.forEach(holding => {
					const currentPrice = holding.currentPrice || holding.averagePrice; // In real app, fetch current price
					const marketValue = holding.shares * currentPrice;
					const costBasis = holding.shares * holding.averagePrice;
					const gain = marketValue - costBasis;

					totalValue += marketValue;
					totalCost += costBasis;
					totalGain += gain;
				});

				if (totalCost > 0) {
					totalGainPercent = (totalGain / totalCost) * 100;
				}

				// Update performance
				state.updatePortfolioPerformance({
					totalValue,
					totalCost,
					totalGain,
					totalGainPercent
				});
			},

			// Get portfolio analytics
			getPortfolioAnalytics: () => {
				const state = get();
				const { holdings, transactions, performance } = state.portfolio;

				// Sector allocation
				const sectorAllocation = holdings.reduce((acc, holding) => {
					const sector = holding.sector || 'Unknown';
					const value = holding.shares * (holding.currentPrice || holding.averagePrice);
					acc[sector] = (acc[sector] || 0) + value;
					return acc;
				}, {});

				// Top holdings
				const topHoldings = holdings
					.map(holding => ({
						...holding,
						value: holding.shares * (holding.currentPrice || holding.averagePrice)
					}))
					.sort((a, b) => b.value - a.value)
					.slice(0, 10);

				// Recent transactions
				const recentTransactions = transactions
					.sort((a, b) => new Date(b.date) - new Date(a.date))
					.slice(0, 20);

				// Performance over time — derived from real transactions only.
				// Empty array signals the UI to show an "add transactions" empty state.
				let performanceHistory = [];
				if (transactions.length > 0) {
					const sorted = [...transactions]
						.filter((t) => t.type === "buy" || t.type === "sell")
						.sort((a, b) => new Date(a.date) - new Date(b.date));

					let runningCostBasis = 0;
					const byDate = sorted.reduce((acc, t) => {
						runningCostBasis +=
							t.type === "buy"
								? t.shares * t.price + (t.fees || 0)
								: -(t.shares * t.price) + (t.fees || 0);
						const date = new Date(t.date).toLocaleDateString();
						acc[date] = {
							date,
							value: Math.round(runningCostBasis),
							transactions: (acc[date]?.transactions || 0) + 1,
						};
						return acc;
					}, {});
					performanceHistory = Object.values(byDate);
				}

				return {
					sectorAllocation,
					topHoldings,
					recentTransactions,
					performanceHistory
				};
			},

			// Get holding by symbol
			getHoldingBySymbol: (symbol) => {
				const state = get();
				return state.portfolio.holdings.find(h => h.symbol === symbol.toUpperCase());
			},

			// Get transactions by symbol
			getTransactionsBySymbol: (symbol) => {
				const state = get();
				return state.portfolio.transactions
					.filter(t => t.symbol === symbol.toUpperCase())
					.sort((a, b) => new Date(b.date) - new Date(a.date));
			},

			// Load portfolio from API (call on PortfolioPage mount)
			loadPortfolio: async () => {
				try {
					const data = await fetchPortfolio();
					let holdings = normalizeHoldings(data.holdings);
					const symbols = [...new Set(holdings.map((h) => h.symbol))];
					if (symbols.length > 0) {
						try {
							const quotes = await fetchBatchQuotes(symbols);
							const priceMap = Object.fromEntries(
								quotes.map((q) => [q.symbol, q.price])
							);
							holdings = holdings.map((h) => ({
								...h,
								currentPrice: priceMap[h.symbol] ?? h.averagePrice,
							}));
						} catch (priceErr) {
							console.warn("Quote fetch failed; using averagePrice fallback:", priceErr);
						}
					}
					set((state) => ({
						portfolio: {
							...state.portfolio,
							holdings,
							transactions: normalizeTransactions(data.transactions),
							settings: data.settings || state.portfolio.settings,
						},
					}));
					get().calculatePortfolioMetrics();
				} catch (error) {
					console.error("loadPortfolio failed:", error);
				}
			},

			// One-time migration of pre-API localStorage portfolio data
			migrateLocalPortfolio: async () => {
				if (localStorage.getItem("mp_portfolio_migrated")) return;
				try {
					const stored = localStorage.getItem("stock-dashboard-store");
					const parsed = stored ? JSON.parse(stored) : null;
					const old = parsed?.state?.portfolio;
					const hasData =
						(Array.isArray(old?.holdings) && old.holdings.length > 0) ||
						(Array.isArray(old?.transactions) && old.transactions.length > 0);
					if (hasData) {
						await apiImportPortfolio({
							holdings: old.holdings,
							transactions: old.transactions,
							settings: old.settings,
						});
					}
				} catch (error) {
					console.error("migrateLocalPortfolio failed:", error);
				} finally {
					localStorage.setItem("mp_portfolio_migrated", "1");
				}
			},

			// ---- Theme State ----
			theme: "light",

			setTheme: (theme) => {
				set({ theme });
			},

			toggleTheme: () => {
				const current = get().theme;
				const newTheme = current === "dark" ? "light" : "dark";
				set({ theme: newTheme });
			},
		}),
		{
			name: "stock-dashboard-store",
			partialize: (state) => ({
				user: state.user,
				theme: state.theme,
			}),
		}
	)
);

export default useStore;
