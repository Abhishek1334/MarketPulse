import { useState } from "react";
import moment from "moment";
import { Trash2, PenBox, TrendingUp, DollarSign, Calendar, FileText, Loader2 } from "lucide-react";
import { DeleteStockFromWatchlist, UpdateStockInWatchlist } from "@/api/stock";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ConfirmationModal from "../ConfirmationModal";
import { showError, showSuccess } from "@/utils/toast.jsx";
import EditModal from "../EditModal";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
		<Card 
			className="bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm border-[var(--background-200)] dark:border-[var(--background-300)] shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
			onClick={(e) => {
				handlePreviewStock(stock);
			}}
		>
			<CardContent className="p-0">
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
					<div className="flex justify-between items-start mb-4">
						<div 
							onClick={(e) => {
								e.stopPropagation()
								navigate(`/stocks/${stock.symbol}`)				
							}} 
							className="flex-1"
						>
							<div className="flex items-center gap-2 mb-2">
								<div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-lg flex items-center justify-center">
									<TrendingUp className="w-4 h-4 text-white" />
								</div>
								<h3 className="font-bold text-lg text-[var(--text-900)] dark:text-[var(--text-50)]">
									{stock.symbol}
								</h3>
							</div>
							<div className="flex items-center gap-1 text-xs text-[var(--text-600)] dark:text-[var(--text-400)]">
								<Calendar className="w-3 h-3" />
								<span>Added: {moment(stock.addedAt).format("MMM D, YYYY")}</span>
							</div>
						</div>
						<div className="flex gap-2 ml-3">
							<Button
								variant="ghost"
								size="sm"
								className="p-2 h-9 w-9 bg-green-50 hover:bg-green-100 dark:bg-[var(--background-300)] dark:hover:bg-[var(--background-400)] transition-colors"
								onClick={(e) => {
									e.stopPropagation();
									setIsEditingModalOpen(true);
								}}
							>
								<PenBox className="w-4 h-4 text-green-600 dark:text-green-400" />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="p-2 h-9 w-9 bg-red-50 hover:bg-red-100 dark:bg-[var(--background-300)] dark:hover:bg-[var(--background-400)] transition-colors"
								disabled={isDeleteQueryLoading}
								onClick={(e) => {
									e.stopPropagation();
									setIsConfirmModalOpen(true);
								}}
							>
								{isDeleteQueryLoading ? (
									<Loader2 className="w-4 h-4 animate-spin text-red-600 dark:text-red-400" />
								) : (
									<Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
								)}
							</Button>
						</div>
					</div>
					
					<div className="space-y-3">
						<div className="flex items-center justify-between p-3 bg-[var(--background-50)] dark:bg-[var(--background-100)] rounded-lg">
							<div className="flex items-center gap-2">
								<DollarSign className="w-4 h-4 text-[var(--primary-500)] dark:text-[var(--primary-400)]" />
								<span className="text-sm font-medium text-[var(--text-700)] dark:text-[var(--text-300)]">
									{stock.targetPrice ? "Target Price" : "Price"}
								</span>
							</div>
							<span className="text-base font-bold text-[var(--primary-600)] dark:text-[var(--primary-400)]">
								{stock.targetPrice ? `$${stock.targetPrice}` : "---"}
							</span>
						</div>
						
						{stock.note && (
							<div className="p-3 bg-[var(--background-50)] dark:bg-[var(--background-100)] rounded-lg">
								<div className="flex items-center gap-2 mb-2">
									<FileText className="w-4 h-4 text-[var(--accent-500)] dark:text-[var(--accent-400)]" />
									<span className="text-sm font-medium text-[var(--text-700)] dark:text-[var(--text-300)]">Note</span>
								</div>
								<p className="text-sm text-[var(--text-800)] dark:text-[var(--text-200)] leading-relaxed">
									{stock.note}
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Desktop Layout */}
				<div className="hidden sm:grid sm:grid-cols-4 lg:grid-cols-5 gap-4 p-4 items-center">
					<div 
						onClick={(e) => {
							e.stopPropagation()
							navigate(`/stocks/${stock.symbol}`)				
						}} 
						className="cursor-pointer hover:text-[var(--primary-600)] dark:hover:text-[var(--primary-400)] transition-colors"
					>
						<div className="flex items-center gap-2 mb-1">
							<div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-lg flex items-center justify-center">
								<TrendingUp className="w-4 h-4 text-white" />
							</div>
							<h3 className="font-semibold text-base lg:text-lg text-[var(--text-900)] dark:text-[var(--text-50)]">
								{stock.symbol}
							</h3>
						</div>
						<div className="flex items-center gap-1 text-xs text-[var(--text-600)] dark:text-[var(--text-400)]">
							<Calendar className="w-3 h-3" />
							<span>Added: {moment(stock.addedAt).format("MMM D, YYYY")}</span>
						</div>
					</div>

					<div className="flex items-center gap-2 p-3 bg-[var(--background-50)] dark:bg-[var(--background-100)] rounded-lg">
						<DollarSign className="w-4 h-4 text-[var(--primary-500)] dark:text-[var(--primary-400)]" />
						<div>
							<p className="text-sm font-medium text-[var(--text-700)] dark:text-[var(--text-300)]">
								{stock.targetPrice ? "Target Price" : "Price"}
							</p>
							<p className="text-base lg:text-lg font-bold text-[var(--primary-600)] dark:text-[var(--primary-400)]">
								{stock.targetPrice ? `$${stock.targetPrice}` : "---"}
							</p>
						</div>
					</div>

					<div className="lg:col-span-2 hidden lg:block">
						{stock.note ? (
							<div className="p-3 bg-[var(--background-50)] dark:bg-[var(--background-100)] rounded-lg">
								<div className="flex items-center gap-2 mb-1">
									<FileText className="w-4 h-4 text-[var(--accent-500)] dark:text-[var(--accent-400)]" />
									<span className="text-sm font-medium text-[var(--text-700)] dark:text-[var(--text-300)]">Note</span>
								</div>
								<p className="text-sm lg:text-base text-[var(--text-800)] dark:text-[var(--text-200)] truncate">
									{stock.note}
								</p>
							</div>
						) : (
							<div className="p-3 bg-[var(--background-50)] dark:bg-[var(--background-100)] rounded-lg">
								<div className="flex items-center gap-2 mb-1">
									<FileText className="w-4 h-4 text-[var(--text-500)] dark:text-[var(--text-400)]" />
									<span className="text-sm font-medium text-[var(--text-600)] dark:text-[var(--text-400)]">Note</span>
								</div>
								<p className="text-sm lg:text-base text-[var(--text-500)] dark:text-[var(--text-400)]">
									No note added
								</p>
							</div>
						)}
					</div>

					<div className="flex justify-end gap-2">
						<Button
							variant="ghost"
							size="sm"
							className="p-2 h-9 w-9 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
							onClick={(e) => {
								e.stopPropagation();
								setIsEditingModalOpen(true);
							}}
						>
							<PenBox className="w-4 h-4 text-green-600 dark:text-green-400" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="p-2 h-9 w-9 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
							disabled={isDeleteQueryLoading}
							onClick={(e) => {
								e.stopPropagation();
								setIsConfirmModalOpen(true);
							}}
						>
							{isDeleteQueryLoading ? (
								<Loader2 className="w-4 h-4 animate-spin text-red-600 dark:text-red-400" />
							) : (
								<Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
							)}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default StockCard;
