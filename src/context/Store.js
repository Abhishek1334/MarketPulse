import { create } from "zustand";

const useStore = create((set, get) => ({
	// ---- Auth State ----
	user: null,
	login: ({ user, token }) => {
		const userWithToken = { ...user, token };
		localStorage.setItem("authUser", JSON.stringify(userWithToken));
		set({ user: userWithToken });
	},
	logout: () => {
		localStorage.removeItem("authUser");
		set({ user: null });
	},
	initializeUser: () => {
		const storedUser = localStorage.getItem("authUser");
		if (storedUser) {
			set({ user: JSON.parse(storedUser) });
		} else {
			set({ user: null });
		}
	},
	isLoggedIn: () => !!get().user,

	// ---- Watchlists State ----
	watchlists: [],

	// used to update watchlists
	setWatchlists: (watchlists) => set({ watchlists }),

	// used to add a new watchlist
	addWatchlist: (newWatchlist) =>
		set((state) => ({
			watchlists: [...state.watchlists, newWatchlist],
		})),

	// used to delete a watchlist
	deleteWatchlist: (id) =>
		set((state) => ({
			watchlists: state.watchlists.filter((w) => w._id !== id),
		})),

	// ---- Stock Actions ----
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
	theme: localStorage.getItem("theme") || "light",
	setTheme: (theme) => {
		localStorage.setItem("theme", theme);
		set({ theme });
	},
	toggleTheme: () => {
		const current = get().theme;
		const newTheme = current === "dark" ? "light" : "dark";
		localStorage.setItem("theme", newTheme);
		set({ theme: newTheme });
	},
}));

export default useStore;





// question : do i need to call setwatchlists after creating a new watchlist or deleting a watchlist
// answer: no
{
	/* 
	
Action						Built-in state update?	Need to call setWatchlists?
addWatchlist(newW)			✅ Yes					❌ No
deleteWatchlist(id)			✅ Yes					❌ No
Fetch all watchlists		❌ No					✅ Yes (setWatchlists(fetchedWatchlists)
Update one item manually	❌ No					✅ Yes (setWatchlists(...))
	
	*/
}