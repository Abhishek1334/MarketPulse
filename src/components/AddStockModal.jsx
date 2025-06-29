import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useStore from "../context/Store";
import { useEffect, useState } from "react";
import { AddStockToWatchlist } from "../api/stock";
import { showError, showSuccess } from "../utils/toast.jsx";

const AddStockModal = ({ open, setOpen, stock }) => {
	const { watchlists, addStockToWatchlist } = useStore((state) => state);
	const queryClient = useQueryClient();

	const [filteredWatchlists, setFilteredWatchlists] = useState([]);

	const { mutate: addStockMutate, isLoading: isAdding } = useMutation({
		mutationFn: async ({ watchlistId, stock }) => {
			const payload = [
				typeof stock === "string"
					? { symbol: stock }
					: { symbol: stock.symbol }
			];

			const response = await AddStockToWatchlist(watchlistId, payload);
			return response;
		},
		onSuccess: (newStock, variables) => {
			const { watchlistId } = variables;

			addStockToWatchlist(watchlistId, newStock);

			queryClient.invalidateQueries(["watchlist", watchlistId]);
			queryClient.setQueryData(["watchlists"], (oldData = []) => {
				return oldData.map((watchlist) =>
					watchlist._id === watchlistId
						? {
								...watchlist,
								stocks: [
									...watchlist.stocks,
									...newStock.stocks,
								],
						  }
						: watchlist
				);
			});

			showSuccess("Stock added successfully!");
		},
		onError: (error) => {
			showError(`Error: ${error.message || "Something went wrong."}`);
		},
	});

	useEffect(() => {
		if (!stock) return;

		const filtered = watchlists.filter((watchlist) => {
			return !watchlist.stocks.some(
				(item) =>
					item.symbol === (stock?.symbol || stock)
			);
		});
		setFilteredWatchlists(filtered);
	}, [watchlists, stock]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const selectedWatchlistIds = Array.from(e.target.elements)
			.filter((el) => el.checked)
			.map((el) => el.id);

		if (selectedWatchlistIds.length === 0) {
			showError("Please select at least one watchlist.");
			return;
		}

		// Send each selected watchlist with correct payload
		selectedWatchlistIds.forEach((id) => {
			addStockMutate({ watchlistId: id, stock });
		});

		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[425px] bg-[var(--background-900)] dark:bg-[var(--background-100)] text-[var(--text-50)] dark:text-[var(--text-950)]">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-[var(--text-50)] dark:text-[var(--text-950)]">
						Adding Stock: {stock?.symbol || stock}
					</DialogTitle>
				</DialogHeader>

				<DialogDescription className="text-[var(--text-300)] dark:text-[var(--text-600)]">
					Please select the watchlists you want to add this stock to.
				</DialogDescription>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-4 mt-4"
				>
					<div className="flex flex-col gap-3">
						{filteredWatchlists.map((watchlist) => (
							<div
								key={watchlist._id}
								className="flex items-center gap-2"
							>
								<input
									type="checkbox"
									id={watchlist._id}
									name={watchlist.name}
									className="w-4 h-4 text-[var(--primary-600)] bg-[var(--background-100)] dark:bg-[var(--background-200)] border-[var(--border)] dark:border-[var(--background-300)] rounded focus:ring-[var(--primary-500)]"
								/>
								<label htmlFor={watchlist._id} className="text-[var(--text-50)] dark:text-[var(--text-950)]">
									{watchlist.name}
								</label>
							</div>
						))}
					</div>

					<div className="flex gap-4 mt-6">
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="font-[Raleway] border-2 border-[var(--background-50)] dark:border-[var(--background-300)] px-3 py-2 rounded-2xl text-base font-semibold text-[var(--background-50)] dark:text-[var(--text-950)] hover:bg-[var(--background-50)] dark:hover:bg-[var(--background-300)] hover:text-[var(--text-950)] dark:hover:text-[var(--text-50)] transition-colors"
						>
							Cancel
						</button>

						<button
							type="submit"
							disabled={isAdding}
							className="font-[Raleway] border-2 border-[var(--primary-600)] dark:border-[var(--primary-500)] px-3 py-2 rounded-2xl text-base font-semibold text-[var(--primary-600)] dark:text-[var(--primary-500)] hover:bg-[var(--primary-600)] dark:hover:bg-[var(--primary-500)] hover:text-white dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isAdding ? "Adding..." : "Add"}
						</button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddStockModal;
