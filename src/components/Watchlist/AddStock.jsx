import { useState } from "react";
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

export default function AddStockModal({ watchlistId }) {
	const [symbol, setSymbol] = useState("");
	const [note, setNote] = useState("");
	const [targetPrice, setTargetPrice] = useState("");
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const handleAddStock = async (e) => {
		e.preventDefault();

		if (!symbol) {
			showError("Stock symbol is required.");
			return;
		}

		try {
			setLoading(true);

			const response = await AddStocksToWatchlist(
				watchlistId,
				symbol,
				note,
				targetPrice
			);

			if (response) {
				resetModal();
				setOpen(false);
				showSuccess("Stock added successfully!");
			}
			
			
		} catch (error) {
			console.error("Error Response:", error);
			showError(
				error.message
			);
		} finally {
			setLoading(false); 
		}
	};

	const resetModal = () => {
		setSymbol("");
		setNote("");
		setTargetPrice("");
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				className="bg-[var(--background-950)] text-[var(--text-50)] px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1
				hover:bg-[var(--background-800)] hover:text-[var(--text-100)] hover:scale-104 transition-all duration-200 ease-in-out 
			"
			>
				<Plus size={16} /> Add Stock
			</DialogTrigger>
			<DialogContent className="bg-[var(--background-50)] text-[var(--text-950)] ">
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
						onChange={(e) => setSymbol(e.target.value)}
						className="modal-inputField"
						required
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
						className="
						modal-inputField"
					/>
					<button
						type="submit"
						disabled={loading}
						className="modal-button"
					>
						{loading ? (
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
