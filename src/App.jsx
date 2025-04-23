import { Outlet } from "react-router-dom";
import useStore from "./context/Store";
import { Slide, ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getWatchlistsByUser } from "@/api/watchlist";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

function App() {
	const setWatchlists = useStore((state) => state.setWatchlists);
	const hasHydrated = useStore.persist.hasHydrated(); 

	const { data: watchlists, isSuccess } = useQuery({
		queryKey: ["watchlists"],
		queryFn: getWatchlistsByUser,
		enabled: hasHydrated,
		staleTime: 5 * 60 * 1000,
	});

	useEffect(() => {
		if (isSuccess && watchlists) {
			setWatchlists(watchlists);
		}
	}, [isSuccess, watchlists]);

	if (!hasHydrated) {
		return <div className="text-center py-20 text-xl">Loading...</div>;
	}

	return (
		<div className="bg-[var(--background-50)] min-h-screen transition-all duration-500 ease-in-out">
			<ToastContainer
				transition={Slide}
				position="top-right"
				autoClose={2500}
				theme="light"
				closeOnClick
				draggable
			/>
			<Outlet />
		</div>
	);
}

export default App;
