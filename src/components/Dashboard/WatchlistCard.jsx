import { FaListAlt } from "react-icons/fa";
import { Eye, Pencil, Trash2, Save, XSquare, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TooltipIconButton from "../TooltipIconButton";
import { updateWatchlistName } from "../../api/watchlist";
import { showSuccess, showError } from "../../utils/toast.jsx";
import { DeleteAWatchlist } from "../../api/watchlist";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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
		<Card className="bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm border-[var(--background-200)] dark:border-[var(--background-300)] shadow-lg hover:shadow-xl transition-all duration-200">
			<CardContent className="p-5 max-md:p-3">
				{isModalOpen && (
					<ConfirmationModal
						open={isModalOpen}
						setOpen={setIsModalOpen}
						onConfirm={handleConfirmDelete}
						onCancel={handleCancelDelete}
						watchlist={true}
					/>
				)}
				
				<div className="flex items-center gap-3 mb-3">
					<div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-lg flex items-center justify-center">
						<FaListAlt className="text-white text-lg" />
					</div>
					
					{isEditing ? (
						<form
							onSubmit={handleEditing}
							className="flex items-center gap-2 flex-1"
						>
							<Input
								type="text"
								value={watchlistName}
								onChange={handleChange}
								className="flex-1 bg-[var(--background-50)] dark:bg-[var(--background-100)] border-[var(--background-300)] dark:border-[var(--background-400)] text-[var(--text-900)] dark:text-[var(--text-50)] focus:border-[var(--primary-500)] dark:focus:border-[var(--primary-400)] focus:ring-[var(--primary-500)] dark:focus:ring-[var(--primary-400)]"
								required
								autoFocus
								onKeyDown={(e) =>
									e.key === "Enter" && handleEditing(e)
								}
							/>
							<Button
								type="submit"
								size="sm"
								disabled={
									watchlistName.trim() === watchlist.name ||
									isUpdating
								}
								className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
							>
								{isUpdating ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Save className="w-4 h-4" />
								)}
							</Button>
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={handleCancelUpdate}
								className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
							>
								<XSquare className="w-4 h-4" />
							</Button>
						</form>
					) : (
						<div
							className="cursor-pointer truncate flex-1"
							onClick={() => navigate(`/watchlist/${watchlist._id}`)}
						>
							<h3 className="font-semibold text-lg max-md:text-base text-[var(--text-900)] dark:text-[var(--text-50)] hover:text-[var(--primary-600)] dark:hover:text-[var(--primary-400)] transition-colors">
								{watchlist.name}
							</h3>
						</div>
					)}
				</div>

				<p className="text-md font-medium text-[var(--text-700)] dark:text-[var(--text-300)] mb-4">
					Stocks Tracked:{" "}
					<span className="font-semibold text-[var(--primary-600)] dark:text-[var(--primary-400)]">
						{stocks.length}
					</span>
				</p>

				<div className="flex flex-wrap gap-3 justify-start">
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
			</CardContent>
		</Card>
	);
};

export default WatchlistCard;
