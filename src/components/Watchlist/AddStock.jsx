import { useEffect, useState, useRef } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { AddStocksToWatchlist } from "@/api/stock";
import { showError, showSuccess } from "@/utils/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useStore from "@/context/Store";
import { set } from "mongoose";

export default function AddStockModal({ watchlistId }) {
	const [symbol, setSymbol] = useState("");
	const [note, setNote] = useState("");
	const [targetPrice, setTargetPrice] = useState("");
	const [open, setOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const queryClient = useQueryClient();
	const { addStockToWatchlist } = useStore();

	const {
		mutate: addStockMutate,
		isLoading: isAdding,
		isError: isAddError,
		error: addError,
	} = useMutation({
		mutationFn: async () => {
			const response = await AddStocksToWatchlist(
				watchlistId,
				symbol,
				note,
				targetPrice
			);
			return response;
		},
		onSuccess: (newStock) => {
			setIsEditing(false);

			addStockToWatchlist(watchlistId, newStock);

			// Invalidate single watchlist query to trigger refetch
			queryClient.invalidateQueries(["watchlist", watchlistId]);

			// (Optional) Still update list if needed
			queryClient.setQueryData(["watchlists"], (oldData = []) => {
				return oldData.map((watchlist) =>
					watchlist._id === watchlistId
						? {
								...watchlist,
								stocks: [...watchlist.stocks, newStock],
						}
						: watchlist
				);
			});
			
			showSuccess("Stock added successfully!");
			resetModal();
			setOpen(false);
		},
		onError: (error) => {
			showError(`Error: ${error.message || "Something went wrong."}`);
		},
	});

	const handleAddStock = (e) => {
		e.preventDefault();

		if (!/^[A-Z]{1,5}$/.test(symbol.trim().toUpperCase())) {
			showError("Enter a valid stock symbol (e.g., AAPL).");
			return;
		}

		if (targetPrice && Number(targetPrice) <= 0) {
			showError("Target price must be greater than zero.");
			return;
		}


		addStockMutate();
	};

	const resetModal = () => {
		setIsEditing(false);
		setSymbol("");
		setNote("");
		setTargetPrice("");
	};

	useEffect(() => {
		if (isAddError && addError?.message) {
			showError(addError.message);
		}
	}, [isAddError, addError]);

	return (
		<Dialog
			open={open}
			onOpenChange={(val) => {
				setOpen(val);
				if (!val) resetModal();
			}}
		>
			<DialogTrigger
				className="bg-[var(--background-950)] text-[var(--text-50)] px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1
        hover:bg-[var(--background-800)] hover:text-[var(--text-100)] hover:scale-104 transition-all duration-200 ease-in-out"
				onClick={() => setIsEditing(true)}
			>
				<Plus size={16} /> Add Stock
			</DialogTrigger>
			<DialogContent className="bg-[var(--background-50)] text-[var(--text-950)]">
				<DialogHeader>
					<DialogTitle>Add a Stock</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={handleAddStock}
					className="space-y-4 mt-4 flex flex-col"
				>
					<input
						type="text"
						placeholder="Stock Symbol (e.g. AAPL)"
						value={symbol}
						onChange={(e) =>
							setSymbol(e.target.value.toUpperCase())
						}
						className="modal-inputField"
						required
						ref={(ref) => ref && isEditing && ref.focus()}
					/>
					<input
						type="text"
						placeholder="Note (optional)"
						value={note}
						onChange={(e) => setNote(e.target.value)}
						className="modal-inputField"
					/>
					<input
						type="number"
						placeholder="Target Price (optional)"
						value={targetPrice}
						onChange={(e) => setTargetPrice(e.target.value)}
						className="modal-inputField"
					/>
					<button
						type="submit"
						disabled={isAdding}
						className="modal-button"
					>
						{isAdding ? (
							<span className="animate-pulse">Adding...</span>
						) : (
							"Add Stock"
						)}
					</button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
