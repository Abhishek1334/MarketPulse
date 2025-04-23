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
