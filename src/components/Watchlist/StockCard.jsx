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
			className="bg-[var(--secondary-50)] rounded-xl shadow-sm border border-[var(--secondary-200)] cursor-pointer hover:bg-[var(--secondary-100)] hover:shadow-md transition-all duration-200 ease-in-out"
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
			
			{/* Mobile Layout */}
			<div className="block sm:hidden p-4">
				<div className="flex justify-between items-start mb-3">
					<div onClick={(e) => {
						e.stopPropagation()
						navigate(`/stocks/${stock.symbol}`)				
					}} className="flex-1">
						<p className="font-bold text-lg text-[var(--text-950)]">{stock.symbol}</p>
						<p className="text-xs text-[var(--text-600)] mt-1">
							Added: {moment(stock.addedAt).format("MMM D, YYYY")}
						</p>
					</div>
					<div className="flex gap-3 ml-3">
						<button
							className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
							onClick={(e) => {
								e.stopPropagation();
								setIsEditingModalOpen(true);
							}}
						>
							<PenBox className="w-4 h-4 text-green-600" />
						</button>
						<button
							className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
							disabled={isDeleteQueryLoading}
							onClick={(e) => {
								e.stopPropagation();
								setIsConfirmModalOpen(true);
							}}
						>
							{isDeleteQueryLoading ? (
								<div className="animate-spin rounded-full w-4 h-4 border-2 border-red-300 border-t-red-600"></div>
							) : (
								<Trash2 className="w-4 h-4 text-red-600" />
							)}
						</button>
					</div>
				</div>
				
				<div className="grid grid-cols-1 gap-3">
					<div className="flex justify-between items-center">
						<span className="text-sm font-medium text-[var(--text-600)]">
							{stock.targetPrice ? "Target Price" : "Price"}
						</span>
						<span className="text-base font-bold text-blue-600">
							{stock.targetPrice ? `$${stock.targetPrice}` : "---"}
						</span>
					</div>
					
					{stock.note && (
						<div>
							<p className="text-sm font-medium text-[var(--text-600)] mb-1">Note</p>
							<p className="text-sm text-[var(--text-800)] bg-[var(--background-100)] p-2 rounded-lg">
								{stock.note}
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Desktop Layout */}
			<div className="hidden sm:grid sm:grid-cols-4 lg:grid-cols-5 gap-4 p-4 text-[var(--text-950)] items-center">
				<div onClick={(e) => {
					e.stopPropagation()
					navigate(`/stocks/${stock.symbol}`)				
				}} className="cursor-pointer hover:text-blue-600 transition-colors">
					<p className="font-semibold text-base lg:text-lg">{stock.symbol}</p>
					<p className="text-xs text-[var(--text-600)]">
						Added: {moment(stock.addedAt).format("MMM D, YYYY")}
					</p>
				</div>

				<div>
					<p className="text-sm font-medium text-[var(--text-600)]">
						{stock.targetPrice ? "Target Price" : "Price"}
					</p>
					<p className="text-base lg:text-lg font-bold text-blue-600">
						{stock.targetPrice ? `$${stock.targetPrice}` : "---"}
					</p>
				</div>

				<div className="lg:col-span-2 hidden lg:block">
					<p className="text-sm font-medium text-[var(--text-600)]">Note</p>
					<p className="text-sm lg:text-base truncate">{stock.note || "---"}</p>
				</div>

				<div className="flex justify-end gap-3">
					<button
						className="p-2 rounded-lg hover:bg-green-50 transition-colors"
						onClick={(e) => {
							e.stopPropagation();
							setIsEditingModalOpen(true);
						}}
					>
						<PenBox className="w-4 h-4 text-green-600" />
					</button>
					<button
						className="p-2 rounded-lg hover:bg-red-50 transition-colors"
						disabled={isDeleteQueryLoading}
						onClick={(e) => {
							e.stopPropagation();
							setIsConfirmModalOpen(true);
						}}
					>
						{isDeleteQueryLoading ? (
							<div className="animate-spin rounded-full w-4 h-4 border-2 border-red-300 border-t-red-600"></div>
						) : (
							<Trash2 className="w-4 h-4 text-red-600" />
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default StockCard;
