import { FaListAlt } from "react-icons/fa";
import { Eye, Pencil, Trash2, Save, XSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TooltipIconButton from "../TooltipIconButton";
import { updateWatchlistName } from "../../api/watchlist";
import { showSuccess, showError } from "../../utils/toast";
import useStore from "../../context/Store";
import { DeleteAWatchlist } from "../../api/watchlist";
import ConfirmationModal from "@/components/ConfirmationModal";

const WatchlistCard = ({ watchlist }) => {

	const [isEditing, setIsEditing] = useState(false);
	const [watchlistName, setWatchlistName] = useState(watchlist.name);
	
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { watchlists, setWatchlists, deleteWatchlist } = useStore();



	const navigate = useNavigate();

	const handleChange = (e) => {
		setWatchlistName(e.target.value);
	}

	const toggleEditing = () => {
		setIsEditing((prev) => !prev);
	}

	const handleEditing = async () => {
		
		e.preventDefault();

		if(!watchlistName) {
			showError("Watchlist name is required.");
			return;
		}

		if(watchlistName === watchlist.name) {
			return;
		}
		
		setIsEditing(false);

		try{
			const response = await updateWatchlistName(watchlist._id, watchlistName);
			setWatchlists(watchlists.map((w) => {
				if(w._id === watchlist._id) {
					return response.watchlist;
				}
				return w;
			})
			);
			showSuccess(response.message || "Watchlist name updated.");
		} catch (error) {
			console.error("Error updating watchlist:", error);
			showError(error.message || "Something went wrong with the server.");
		}

	}

	const handleDelete = () => {
		setIsModalOpen(true);
	}

	const handleCancelDelete = () => {
		setIsModalOpen(false);
	}

	const handleConfirmDelete = async () => {
		try {
			await DeleteAWatchlist(watchlist._id);
			deleteWatchlist(watchlist._id);
			setWatchlists(watchlists.filter((w) => w._id !== watchlist._id));
			showSuccess("Watchlist deleted.");
		} catch (error) {
			console.error("Error deleting watchlist:", error);
			showError("Something went wrong with the server.");
		}
		setIsModalOpen(false);
	};




	return (
		<li className="bg-[var(--background-50)] text-[var(--text-950)] p-5 rounded-xl shadow-sm hover:shadow-md  border border-[var(--background-200)] transition-all duration-500 ease-in-out">
			<h3 className="font-semibold text-lg flex items-center gap-3 mb-1">
				{isModalOpen && (
					<ConfirmationModal
						onConfirm={handleConfirmDelete}
						onCancel={handleCancelDelete}
					/>
				)}
				<FaListAlt className="text-[var(--primary-500)] size-6" />
				{isEditing ? (
					<form
						onSubmit={handleEditing(e)}
						className="flex items-center gap-2 h-full "
					>
						<input
							type="text"
							value={watchlistName}
							onChange={handleChange}
							className="bg-[var(--background-100)] text-[var(--text-950)] p-2 rounded-md w-[70%] overflow-auto"
							required
						/>
						<button className="bg-[var(--primary-500)] text-white  rounded-md hover:bg-[var(--primary-600)] p-2">
							<Save className="size-6" />
						</button>
						<button
							className="bg-red-500 text-white  rounded-md hover:bg-[var(--primary-600)] p-2"
							onClick={toggleEditing}
						>
							<XSquare className="size-6" />
						</button>
					</form>
				) : (
					watchlist.name
				)}
			</h3>

			<p className="text-md font-medium text-[var(--text-900)] mb-3 ">
				Stocks Tracked:{" "}
				<span className="font-medium">{watchlist.stocks.length}</span>
			</p>

			<div className="flex flex-wrap gap-3 justify-start mt-auto">
				<TooltipIconButton
					icon={Eye}
					label="View Watchlist"
					variant="view"
					onClick={() => navigate(`/watchlist/${watchlist._id}`)}
				/>
				<TooltipIconButton
					icon={Pencil}
					label="Edit Watchlist"
					variant="edit"
					onClick={toggleEditing}
				/>
				<TooltipIconButton
					icon={Trash2}
					label="Delete Watchlist"
					variant="delete"
					className="bg-red-500 hover:bg-red-600 text-white"
					onClick={handleDelete}
				/>
			</div>
		</li>
	);
};

export default WatchlistCard;
