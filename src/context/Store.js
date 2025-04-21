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
// answer: yes

// i create a watchlist and after successful create api call i call add watchlist , do i need to call setWatchlists after that ??
// answer: yes

// why ?
// because i need to update the watchlists state

// same for delete , i call deleteWatchlist api , do i need to call setWatchlists after that ?
// answer: yes 

// why ?
// because i need to update the watchlists state