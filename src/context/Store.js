import { create } from "zustand";
import { persist } from "zustand/middleware";

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
			addHolding: (holding) =>
				set((state) => ({
					portfolio: {
						...state.portfolio,
						holdings: [...state.portfolio.holdings, {
							id: Date.now().toString(),
							symbol: holding.symbol.toUpperCase(),
							shares: parseFloat(holding.shares),
							averagePrice: parseFloat(holding.averagePrice),
							purchaseDate: holding.purchaseDate || new Date().toISOString(),
							notes: holding.notes || '',
							sector: holding.sector || 'Unknown',
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString()
						}]
					}
				})),

			updateHolding: (holdingId, updates) =>
				set((state) => ({
					portfolio: {
						...state.portfolio,
						holdings: state.portfolio.holdings.map((holding) =>
							holding.id === holdingId
								? { ...holding, ...updates, updatedAt: new Date().toISOString() }
								: holding
						)
					}
				})),

			removeHolding: (holdingId) =>
				set((state) => ({
					portfolio: {
						...state.portfolio,
						holdings: state.portfolio.holdings.filter((h) => h.id !== holdingId)
					}
				})),

			addTransaction: (transaction) =>
				set((state) => ({
					portfolio: {
						...state.portfolio,
						transactions: [...state.portfolio.transactions, {
							id: Date.now().toString(),
							symbol: transaction.symbol.toUpperCase(),
							type: transaction.type, // 'buy', 'sell', 'dividend', 'split'
							shares: parseFloat(transaction.shares),
							price: parseFloat(transaction.price),
							date: transaction.date || new Date().toISOString(),
							fees: parseFloat(transaction.fees) || 0,
							notes: transaction.notes || '',
							createdAt: new Date().toISOString()
						}]
					}
				})),

			updatePortfolioPerformance: (performance) =>
				set((state) => ({
					portfolio: {
						...state.portfolio,
						performance: { ...state.portfolio.performance, ...performance }
					}
				})),

			updatePortfolioSettings: (settings) =>
				set((state) => ({
					portfolio: {
						...state.portfolio,
						settings: { ...state.portfolio.settings, ...settings }
					}
				})),

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

				// Performance over time
				let performanceHistory = [];
				if (transactions.length > 0) {
					// Existing logic for real transactions
					const txHistory = transactions
						.filter(t => t.type === 'buy' || t.type === 'sell')
						.reduce((acc, transaction) => {
							const date = new Date(transaction.date).toDateString();
							if (!acc[date]) {
								acc[date] = { date, value: 0, transactions: 0 };
							}
							acc[date].value += transaction.type === 'buy' ? 
								-(transaction.shares * transaction.price) : 
								(transaction.shares * transaction.price);
							acc[date].transactions += 1;
							return acc;
						}, {});
					performanceHistory = Object.values(txHistory);
				} else if (holdings.length > 0) {
					// No transactions, but there are holdings: generate mock 30-day time series
					const today = new Date();
					let baseValue = performance.totalValue || 10000;
					for (let i = 29; i >= 0; i--) {
						const date = new Date(today);
						date.setDate(today.getDate() - i);
						// Simulate small daily changes
						baseValue = baseValue * (1 + (Math.random() - 0.5) * 0.01);
						performanceHistory.push({
							date: date.toLocaleDateString(),
							value: Math.round(baseValue)
						});
					}
				} else {
					// No holdings: show empty chart
					performanceHistory = [];
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

			// Export portfolio data
			exportPortfolio: () => {
				const state = get();
				return {
					holdings: state.portfolio.holdings,
					transactions: state.portfolio.transactions,
					performance: state.portfolio.performance,
					settings: state.portfolio.settings,
					exportDate: new Date().toISOString()
				};
			},

			// Import portfolio data
			importPortfolio: (data) => {
				if (data.holdings && data.transactions) {
					set((state) => ({
						portfolio: {
							...state.portfolio,
							holdings: data.holdings || [],
							transactions: data.transactions || [],
							performance: data.performance || state.portfolio.performance,
							settings: { ...state.portfolio.settings, ...data.settings }
						}
					}));
					return true;
				}
				return false;
			},

			// Clear portfolio
			clearPortfolio: () =>
				set((state) => ({
					portfolio: {
						...state.portfolio,
						holdings: [],
						transactions: []
					}
				})),

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
				portfolio: state.portfolio,
			}),
		}
	)
);

export default useStore;
