import { FaListAlt } from "react-icons/fa";
import { Eye, Pencil, Trash2, Save, XSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TooltipIconButton from "../TooltipIconButton";
import { updateWatchlistName } from "../../api/watchlist";
import { showSuccess, showError } from "../../utils/toast";
import { DeleteAWatchlist } from "../../api/watchlist";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const WatchlistCard = ({ watchlist }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [watchlistName, setWatchlistName] = useState(watchlist.name);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const queryClient = useQueryClient();

	// Mutations for updating and deleting the watchlist
	const {
		mutate: updateMutate,
		isLoading: isUpdating,
		isError: isUpdateError,
		error: updateError,
	} = useMutation({
		mutationFn: async (newName) => {
			const response = await updateWatchlistName(watchlist._id, newName);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries("watchlists");
			showSuccess("Watchlist updated successfully.");
		},
		onError: (error) => {
			showError(`Error: ${error.message || "Something went wrong."}`);
		},
	});

	const {
		mutate: deleteMutate,
		isLoading: isDeleting,
		isError: isDeleteError,
		error: deleteError,
	} = useMutation({
		mutationFn: async () => {
			const response = await DeleteAWatchlist(watchlist._id);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries("watchlists");
			showSuccess("Watchlist deleted successfully.");
		},
		onError: (error) => {
			showError(`Error: ${error.message || "Something went wrong."}`);
		},
	});

	const navigate = useNavigate();

	const handleChange = (e) => {
		setWatchlistName(e.target.value);
	};

	// Toggle editing state and reset name if canceling
	const toggleEditing = () => {
		setIsEditing((prev) => !prev);

		// Reset the name to the original if canceling the edit
		if (isEditing) {
			setWatchlistName(watchlist.name); // Reset to original name
		}
	};

	const handleCancelUpdate = (e) => {
		e.preventDefault();
		setIsEditing(false); // Stop editing and keep the original name
		setWatchlistName(watchlist.name); // Reset to original name
	};

	const handleDelete = () => {
		setIsModalOpen(true);
	};

	const handleCancelDelete = () => {
		setIsModalOpen(false);
	};

	// Handle editing the watchlist name
	const handleEditing = async (e) => {
		e.preventDefault();

		if (!watchlistName.trim()) {
			showError("Watchlist name is required.");
			return;
		}

		if (watchlistName === watchlist.name) {
			setIsEditing(false); // If no change, just stop editing
			return;
		}

		setIsEditing(false);

		try {
			updateMutate(watchlistName);
		} catch (error) {
			console.error(error);
			showError(error.message || "Something went wrong.");
		}
	};

	const handleConfirmDelete = async () => {
		try {
			deleteMutate();
			setIsModalOpen(false);
		} catch (error) {
			console.error(error);
			showError(error.message || "Something went wrong.");
		}
	};

	const stocks = Array.isArray(watchlist.stocks) ? watchlist.stocks : [];

	return (
		<div className="bg-[var(--background-50)] text-[var(--text-950)] p-5 rounded-xl shadow-sm hover:shadow-md border border-[var(--background-200)] transition-all duration-500 ease-in-out
		max-md:p-3 ">
			<h3 className="font-semibold text-lg flex items-center gap-3 mb-1 max-md:font-semibold max-md:text-base">
				{isModalOpen && (
					<ConfirmationModal
						open={isModalOpen}
						setOpen={setIsModalOpen}
						onConfirm={handleConfirmDelete}
						onCancel={handleCancelDelete}
						watchlist={true}
					/>
				)}
				<FaListAlt className="text-[var(--primary-500)] size-6" />
				{isEditing ? (
					<form
						onSubmit={handleEditing}
						className="flex items-center gap-2 h-full "
					>
						<input
							type="text"
							value={watchlistName}
							onChange={handleChange}
							className="bg-[var(--background-100)] text-[var(--text-950)] p-2 rounded-md w-[70%] overflow-auto"
							required
							onKeyDown={(e) =>
								e.key === "Enter" && handleEditing(e)
							}
						/>
						<button
							type="submit"
							className="bg-[var(--primary-500)] text-white rounded-md hover:bg-[var(--primary-600)] p-2"
							disabled={
								watchlistName.trim() === watchlist.name ||
								isUpdating
							}
						>
							<Save className="size-6" />
						</button>
						<button
							type="button" // Prevent form submission on Cancel
							className="bg-red-500 text-white rounded-md hover:bg-[var(--primary-600)] p-2"
							onClick={handleCancelUpdate} // Handle cancel here
						>
							<XSquare className="size-6" />
						</button>
					</form>
				) : (
					<div
						className="cursor-pointer truncate"
						onClick={() => navigate(`/watchlist/${watchlist._id}`)}
					>
						{watchlist.name}
					</div>
				)}
			</h3>

			<p className="text-md font-medium text-[var(--text-900)] mb-3 ">
				Stocks Tracked:{" "}
				<span className="font-medium">{stocks.length}</span>
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
		</div>
	);
};

export default WatchlistCard;
