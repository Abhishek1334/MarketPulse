import { useState } from "react";
import moment from "moment";
import { Trash2, PenBox } from "lucide-react";
import { DeleteStockFromWatchlist, UpdateStockInWatchlist } from "@/api/stock";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ConfirmationModal from "../ConfirmationModal";
import { showError, showSuccess } from "@/utils/toast";
import EditModal from "../EditModal";
import { useNavigate } from "react-router-dom";

const StockCard = ({ stock, watchlistId, handlePreviewStock }) => {
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const {
		mutate: deleteMutate,
		isLoading: isDeleteQueryLoading,
		isError: isDeleteQueryError,
		error: deleteQueryError,
	} = useMutation({
		mutationFn: async ({ watchlistId, stockId }) => {
			const response = await DeleteStockFromWatchlist(
				watchlistId,
				stockId
			);
			return response;
		},
		onMutate: () => {
			setIsConfirmModalOpen(true);
		},
		onSuccess: () => {
			queryClient.invalidateQueries("watchlists"); 
			showSuccess("Stock deleted successfully.");
			setIsConfirmModalOpen(false);
		},
		onError: (error) => {
			showError(`Error: ${error.message || "Something went wrong."}`);
			setIsConfirmModalOpen(false);
		},
	});

	const {
		mutate: updateMutate,
		isLoading: isUpdateQueryLoading,
		isError: isUpdateQueryError,
		error: updateQueryError,
	} = useMutation({
		mutationFn: async ({ watchlistId, stockId, note, targetPrice }) => {
			const response = await UpdateStockInWatchlist(
				watchlistId,
				stockId,
				note,
				targetPrice
			);
			return response;
		},
		onMutate: () => {
			setIsEditingModalOpen(true);
		},
		onSuccess: () => {
			queryClient.invalidateQueries("watchlists"); 
			showSuccess("Stock updated successfully.");
			setIsEditingModalOpen(false);
		},
		onError: (error) => {
			showError(`Error: ${error.message || "Something went wrong."}`);
			setIsEditingModalOpen(false);
		},
	})


	const handleDeleteStock = () => {
		deleteMutate({ watchlistId, stockId: stock._id });
	};

	const handleEditStock = (note, targetPrice) => {
		if(note === stock?.note && targetPrice === stock?.targetPrice){
			setIsEditingModalOpen(false);
			return
		}

		updateMutate({ watchlistId, stockId: stock._id, note, targetPrice });
	}

	return (
		<div
			className="bg-[var(--secondary-50)] rounded-xl shadow-sm p-4 grid grid-cols-5 gap-4 text-[var(--text-950)] items-center border border-[var(--secondary-200)] cursor-pointer hover:bg-[var(--secondary-100)] hover:shadow-md transition-all duration-200 ease-in-out"
			onClick={(e) => {
				handlePreviewStock(stock);
			}}
		>
			<ConfirmationModal
				open={isConfirmModalOpen}
				setOpen={setIsConfirmModalOpen}
				onConfirm={() => handleDeleteStock()}
				onCancel={() => setIsConfirmModalOpen(false)}
				watchlist={false}
			/>
			<EditModal
				open={isEditingModalOpen}
				setOpen={setIsEditingModalOpen}
				initialNote={stock?.note || ""}
				initialTargetPrice={stock?.targetPrice || ""}
				onEditConfirm={(note, targetPrice) => 
					handleEditStock( note, targetPrice )}
				onEditCancel={() => setIsEditingModalOpen(false)}
				isLoading={isUpdateQueryLoading}
			/>
			<div onClick={(e) => {
				e.stopPropagation()
				navigate(`/watchlist/${watchlistId}/analytics/${stock._id}`)				
			}}>
				<p className="font-semibold text-lg">{stock.symbol}</p>
				<p className="text-xs text-[var(--text-600)]">
					Added: {moment(stock.addedAt).format("MMM D, YYYY")}
				</p>
			</div>

			<div>
				<p className="text-sm font-medium text-[var(--text-600)]">
					{stock.targetPrice ? "Target Price" : "Price"}
				</p>
				<p className="text-lg font-bold text-blue-300">
					${stock.targetPrice || "---"}
				</p>
			</div>

			<div className="col-span-2">
				<p className="text-sm font-medium text-[var(--text-600)]">Note</p>
				<p className="text-base">{stock.note || "---"}</p>
			</div>

			{/* Loading and Error States */}
			<div className="flex justify-end p-2 gap-5">
				<button
					className="cursor-pointer"
					onClick={(e) => {
						e.stopPropagation();
						setIsEditingModalOpen(true);
					}}
				>
					<PenBox className="w-5 h-5 text-green-500 mr-2 " />
				</button>
				<button
					className="btn btn-error cursor-pointer"
					disabled={isDeleteQueryLoading}
					onClick={(e) => {
						e.stopPropagation(); // Stop click event from bubbling up
						setIsConfirmModalOpen(true); // Open the modal for confirmation
					}}
				>
					{isDeleteQueryLoading ? (
						<span>Loading...</span> // Consider replacing with a spinner icon
					) : (
						<Trash2 className="w-5 h-5 text-red-500 mr-2" />
					)}
				</button>
			</div>
		</div>
	);
};

export default StockCard;

