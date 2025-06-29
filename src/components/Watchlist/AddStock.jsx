import { useEffect, useState, useRef } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, DollarSign, FileText, TrendingUp, Loader2 } from "lucide-react";
import { AddStockToWatchlist } from "@/api/stock";
import { showError, showSuccess } from "@/utils/toast.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useStore from "@/context/Store";

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
			const response = await AddStockToWatchlist(
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
			<DialogTrigger asChild>
				<Button
					onClick={() => setIsEditing(true)}
					className="bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] hover:from-[var(--primary-600)] hover:to-[var(--accent-600)] text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
				>
					<Plus className="w-4 h-4" />
					Add Stock
				</Button>
			</DialogTrigger>
			
			<DialogContent className="bg-[var(--background-100)] dark:bg-[var(--background-200)] border-[var(--background-200)] dark:border-[var(--background-300)] shadow-2xl max-w-md">
				<DialogHeader className="space-y-3">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-lg flex items-center justify-center">
							<TrendingUp className="w-5 h-5 text-white" />
						</div>
						<div>
							<DialogTitle className="text-xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
								Add New Stock
							</DialogTitle>
							<DialogDescription className="text-[var(--text-600)] dark:text-[var(--text-400)]">
								Add a stock to your watchlist for tracking
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>
				
				<form onSubmit={handleAddStock} className="space-y-6 mt-6">
					<div className="space-y-2">
						<Label htmlFor="symbol" className="text-[var(--text-700)] dark:text-[var(--text-300)] font-medium">
							Stock Symbol *
						</Label>
						<div className="relative">
							<TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-500)] dark:text-[var(--text-400)]" />
							<Input
								id="symbol"
								type="text"
								placeholder="e.g., AAPL, GOOGL, MSFT"
								value={symbol}
								onChange={(e) => setSymbol(e.target.value.toUpperCase())}
								className="pl-10 bg-[var(--background-50)] dark:bg-[var(--background-100)] border-[var(--background-300)] dark:border-[var(--background-400)] focus:border-[var(--primary-500)] dark:focus:border-[var(--primary-400)] focus:ring-[var(--primary-500)] dark:focus:ring-[var(--primary-400)] text-[var(--text-950)] dark:text-[var(--text-50)]"
								required
								autoFocus
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="note" className="text-[var(--text-700)] dark:text-[var(--text-300)] font-medium">
							Note (Optional)
						</Label>
						<div className="relative">
							<FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-500)] dark:text-[var(--text-400)]" />
							<Input
								id="note"
								type="text"
								placeholder="Add a note about this stock"
								value={note}
								onChange={(e) => setNote(e.target.value)}
								className="pl-10 bg-[var(--background-50)] dark:bg-[var(--background-100)] border-[var(--background-300)] dark:border-[var(--background-400)] focus:border-[var(--primary-500)] dark:focus:border-[var(--primary-400)] focus:ring-[var(--primary-500)] dark:focus:ring-[var(--primary-400)] text-[var(--text-950)] dark:text-[var(--text-50)]"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="targetPrice" className="text-[var(--text-700)] dark:text-[var(--text-300)] font-medium">
							Target Price (Optional)
						</Label>
						<div className="relative">
							<DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-500)] dark:text-[var(--text-400)]" />
							<Input
								id="targetPrice"
								type="number"
								step="0.01"
								placeholder="0.00"
								value={targetPrice}
								onChange={(e) => setTargetPrice(e.target.value)}
								className="pl-10 bg-[var(--background-50)] dark:bg-[var(--background-100)] border-[var(--background-300)] dark:border-[var(--background-400)] focus:border-[var(--primary-500)] dark:focus:border-[var(--primary-400)] focus:ring-[var(--primary-500)] dark:focus:ring-[var(--primary-400)] text-[var(--text-950)] dark:text-[var(--text-50)]"
							/>
						</div>
					</div>

					<div className="flex gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							className="flex-1 border-[var(--background-300)] dark:border-[var(--background-400)] text-[var(--text-700)] dark:text-[var(--text-300)] hover:bg-[var(--background-200)] dark:hover:bg-[var(--background-300)]"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isAdding}
							className="flex-1 bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] hover:from-[var(--primary-600)] hover:to-[var(--accent-600)] text-white shadow-lg"
						>
							{isAdding ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Adding...
								</>
							) : (
								<>
									<Plus className="w-4 h-4 mr-2" />
									Add Stock
								</>
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
