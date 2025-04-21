import { useState, useEffect } from "react";
import { getWatchlistsByUser } from "../api/watchlist";
import { showSuccess, showError } from "../utils/toast";
import Header from "../components/Dashboard/Header.jsx";
import SummaryCards from "../components/Dashboard/SummaryCards.jsx";
import Watchlist from "../components/Dashboard/Watchlist.jsx";
import { Plus } from "lucide-react";
import CreateWatchlist from "../components/Dashboard/CreateWatchlist.jsx";
import useStore from "@/context/Store";

const DashboardPage = () => {
	const { setWatchlists, addWatchlist } =
		useStore();

	const [loading, setLoading] = useState(true);

	const [showForm, setShowForm] = useState(false);
	
	useEffect(() => {
		const fetchWatchlists = async () => {
			try {
				const fetchedWatchlists = await getWatchlistsByUser();
				setWatchlists(fetchedWatchlists);
			} catch (error) {
				showError("Failed to fetch watchlists.");
			}
		};
		fetchWatchlists();
		setLoading(false);
	}, []);


	return (
		<div className="p-15">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
				<Header />
				<SummaryCards loading={loading} />
			</div>
			<div >
				<div
					className="text-[var(--text-50)] font-semibold my-5 flex place-self-end bg-[var(--background-950)] rounded-lg p-3 hover:bg-[var(--secondary-800)] hover:cursor-pointer hover:text-[var(--text-200)] text-sm hover:scale-101 transition-all duration-75 ease-in items-center gap-2"
					onClick={() => setShowForm(true)}
				>
					<Plus className="size-6"  />
					Create New Watchlist{" "}
				</div>
				{showForm && (
					<CreateWatchlist
						onClose={() => setShowForm(false)}
					/>
				)}

				<Watchlist
					loading={loading}
				/>
			</div>
			
		</div>
	);
};

export default DashboardPage;
