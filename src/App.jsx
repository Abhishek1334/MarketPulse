// App.jsx
import { Outlet } from "react-router-dom";
import useStore from "./context/Store";
import { Slide, ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getWatchlistsByUser } from "@/api/watchlist";
import FloatingSocial from "@/components/FloatingSocial";
import PriceAlertManager from "@/components/PriceAlertManager";
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
		<div className="flex flex-col h-screen bg-[var(--background-50)] transition-all duration-500 ease-in-out">
			<ToastContainer
				transition={Slide}
				position="top-right"
				autoClose={3000}
				hideProgressBar
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
				toastClassName="!p-0 !m-0 !shadow-lg !rounded-xl !border-0"
				bodyClassName="!p-0 !m-0"
				style={{
					fontSize: '14px',
					fontWeight: '500'
				}}
			/>
			<Outlet />
			<FloatingSocial />
			<PriceAlertManager />
		</div>
	);
}

export default App;
