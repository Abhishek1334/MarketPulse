import React, { useState, useEffect } from "react";
import { X, Plus, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getWatchlistsByUser } from "@/api/watchlist";
import { AddStockToWatchlist } from "@/api/stock";
import { showSuccess, showError, showInfo } from "@/utils/toast";
import useStore from "@/context/Store";

const AddToWatchlistModal = ({ isOpen, onClose, symbol, currentPrice }) => {
	const [watchlists, setWatchlists] = useState([]);
	const [filteredWatchlists, setFilteredWatchlists] = useState([]);
	const [selectedWatchlist, setSelectedWatchlist] = useState("");
	const [note, setNote] = useState("");
	const [targetPrice, setTargetPrice] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingWatchlists, setIsLoadingWatchlists] = useState(true);

	// Get user from store
	const user = useStore((state) => state.user);

	useEffect(() => {
		if (isOpen) {
			fetchWatchlists();
		}
	}, [isOpen]);

	useEffect(() => {
		// Filter out watchlists that already contain the current stock
		if (watchlists.length > 0 && symbol) {
			const availableWatchlists = watchlists.filter(watchlist => {
				// Check if the watchlist has stocks array and if the symbol is not already in it
				return !watchlist.stocks || !watchlist.stocks.some(stock => 
					stock.symbol && stock.symbol.toUpperCase() === symbol.toUpperCase()
				);
			});
			setFilteredWatchlists(availableWatchlists);
		} else {
			setFilteredWatchlists(watchlists);
		}
	}, [watchlists, symbol]);

	const fetchWatchlists = async () => {
		try {
			setIsLoadingWatchlists(true);
			
			// Check if user is authenticated
			if (!user || !user.token) {
				showError("Please log in to access watchlists");
				return;
			}

			const data = await getWatchlistsByUser();
			
			if (data && data.watchlists) {
				setWatchlists(data.watchlists);
			} else if (Array.isArray(data)) {
				setWatchlists(data);
			} else {
				console.error("Unexpected watchlists data format:", data);
				setWatchlists([]);
			}
		} catch (error) {
			console.error("Error fetching watchlists:", error);
			showError(error.message || "Failed to load watchlists");
			setWatchlists([]);
		} finally {
			setIsLoadingWatchlists(false);
		}
	};

	const handleAddToWatchlist = async () => {
		if (!selectedWatchlist) {
			showError("Please select a watchlist");
			return;
		}

		try {
			setIsLoading(true);
			await AddStockToWatchlist(selectedWatchlist, symbol, note, targetPrice);
			showSuccess(`${symbol} added to watchlist successfully!`);
			onClose();
			// Reset form
			setSelectedWatchlist("");
			setNote("");
			setTargetPrice("");
		} catch (error) {
			showError(error.message || "Failed to add stock to watchlist");
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		onClose();
		// Reset form
		setSelectedWatchlist("");
		setNote("");
		setTargetPrice("");
	};

	// Check if all watchlists already contain this stock
	const allWatchlistsHaveStock = watchlists.length > 0 && filteredWatchlists.length === 0;

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<Card className="w-full max-w-md bg-[var(--background-100)] dark:bg-[var(--background-200)] border-[var(--background-200)] dark:border-[var(--background-300)] shadow-2xl transition-all duration-300">
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
							Add {symbol} to Watchlist
						</CardTitle>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleClose}
							className="hover:bg-[var(--background-200)] dark:hover:bg-[var(--background-300)] transition-colors duration-200"
						>
							<X className="h-4 w-4 text-[var(--text-600)] dark:text-[var(--text-400)]" />
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Stock Info */}
					<div className="p-3 bg-[var(--background-200)] dark:bg-[var(--background-300)] rounded-lg">
						<div className="flex items-center justify-between">
							<span className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">Current Price:</span>
							<span className="font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">${currentPrice}</span>
						</div>
					</div>

					{/* Authentication Check */}
					{!user ? (
						<div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
							<p className="text-sm text-red-700 dark:text-red-300">
								Please log in to access watchlists
							</p>
						</div>
					) : (
						<>
							{/* Watchlist Selection */}
							<div className="space-y-2">
								<Label htmlFor="watchlist" className="text-sm font-medium text-[var(--text-700)] dark:text-[var(--text-300)]">
									Select Watchlist
								</Label>
								{isLoadingWatchlists ? (
									<div className="p-3 bg-[var(--background-200)] dark:bg-[var(--background-300)] rounded-lg text-center">
										<div className="flex items-center justify-center gap-2">
											<div className="w-4 h-4 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin"></div>
											<span className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">Loading watchlists...</span>
										</div>
									</div>
								) : allWatchlistsHaveStock ? (
									<div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
										<div className="flex items-center justify-center gap-2 mb-2">
											<CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
											<span className="text-sm font-medium text-blue-700 dark:text-blue-300">
												{symbol} is already in all your watchlists!
											</span>
										</div>
										<p className="text-xs text-blue-600 dark:text-blue-400">
											This stock has been added to all available watchlists.
										</p>
									</div>
								) : filteredWatchlists.length === 0 ? (
									<div className="p-3 bg-[var(--background-200)] dark:bg-[var(--background-300)] rounded-lg text-center">
										<span className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">No available watchlists. Create one from the dashboard first.</span>
									</div>
								) : (
									<select
										id="watchlist"
										value={selectedWatchlist}
										onChange={(e) => setSelectedWatchlist(e.target.value)}
										className="w-full p-3 bg-[var(--background-50)] dark:bg-[var(--background-100)] border border-[var(--background-300)] dark:border-[var(--background-400)] rounded-lg text-[var(--text-900)] dark:text-[var(--text-50)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] transition-all duration-200"
									>
										<option value="">Choose a watchlist...</option>
										{filteredWatchlists.map((watchlist) => (
											<option key={watchlist._id} value={watchlist._id}>
												{watchlist.name} ({watchlist.stocks?.length || 0} stocks)
											</option>
										))}
									</select>
								)}

								{/* Show excluded watchlists info */}
								{watchlists.length > 0 && filteredWatchlists.length < watchlists.length && (
									<div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
										<p className="text-xs text-yellow-700 dark:text-yellow-300">
											{watchlists.length - filteredWatchlists.length} watchlist(s) hidden - {symbol} already exists
										</p>
									</div>
								)}
							</div>

							{/* Target Price */}
							<div className="space-y-2">
								<Label htmlFor="targetPrice" className="text-sm font-medium text-[var(--text-700)] dark:text-[var(--text-300)]">
									Target Price (Optional)
								</Label>
								<Input
									id="targetPrice"
									type="number"
									step="0.01"
									placeholder="Enter target price"
									value={targetPrice}
									onChange={(e) => setTargetPrice(e.target.value)}
									className="bg-[var(--background-50)] dark:bg-[var(--background-100)] border-[var(--background-300)] dark:border-[var(--background-400)] text-[var(--text-900)] dark:text-[var(--text-50)] placeholder-[var(--text-400)] dark:placeholder-[var(--text-500)] focus:ring-[var(--primary-500)]"
								/>
							</div>

							{/* Note */}
							<div className="space-y-2">
								<Label htmlFor="note" className="text-sm font-medium text-[var(--text-700)] dark:text-[var(--text-300)]">
									Note (Optional)
								</Label>
								<Textarea
									id="note"
									placeholder="Add a note about this stock..."
									value={note}
									onChange={(e) => setNote(e.target.value)}
									rows={3}
									className="bg-[var(--background-50)] dark:bg-[var(--background-100)] border-[var(--background-300)] dark:border-[var(--background-400)] text-[var(--text-900)] dark:text-[var(--text-50)] placeholder-[var(--text-400)] dark:placeholder-[var(--text-500)] focus:ring-[var(--primary-500)] resize-none"
								/>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3 pt-2">
								<Button
									variant="outline"
									onClick={handleClose}
									className="flex-1 bg-[var(--background-200)] hover:bg-[var(--background-300)] dark:bg-[var(--background-300)] dark:hover:bg-[var(--background-400)] text-[var(--text-700)] dark:text-[var(--text-300)] border-[var(--background-300)] dark:border-[var(--background-400)] transition-all duration-200"
								>
									Cancel
								</Button>
								<Button
									onClick={handleAddToWatchlist}
									disabled={!selectedWatchlist || isLoading || filteredWatchlists.length === 0 || allWatchlistsHaveStock}
									className="flex-1 bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] hover:from-[var(--primary-600)] hover:to-[var(--accent-600)] text-white shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoading ? (
										<div className="flex items-center gap-2">
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
											Adding...
										</div>
									) : allWatchlistsHaveStock ? (
										<div className="flex items-center gap-2">
											<CheckCircle className="w-4 h-4" />
											Already Added
										</div>
									) : (
										<div className="flex items-center gap-2">
											<Plus className="w-4 h-4" />
											Add to Watchlist
										</div>
									)}
								</Button>
							</div>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default AddToWatchlistModal; 