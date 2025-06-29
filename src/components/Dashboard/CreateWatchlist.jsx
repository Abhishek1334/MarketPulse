import { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Loader2, FolderPlus, TrendingUp, DollarSign, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast.jsx";
import useStore from "@/context/Store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateAWatchlist } from "@/api/watchlist";
import { validateStockSymbol } from "@/api/stock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreateWatchlist = ({ onClose }) => {
	const [name, setName] = useState("");
	const [stocks, setStocks] = useState([
		{ symbol: "", note: "", targetPrice: "", valid: false, validating: false, error: "" },
	]);
	const [validating, setValidating] = useState(false);
	const queryClient = useQueryClient();
	const { addWatchlist } = useStore();
	const validationTimeouts = useRef({});

	const { mutate, isLoading, isError, error } = useMutation({
		mutationFn: async ({ name, stocks }) => {
			const response = await CreateAWatchlist(name, stocks);
			return response; 
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries("watchlists"); 
			addWatchlist(data.watchlist); 
			showSuccess("Watchlist created successfully!");
			resetForm();
			onClose();
		},
		onError: (error) => {
			showError(
				error?.response?.data?.message ||
					error?.message ||
					"Something went wrong."
			);
		},
	});

	// Auto-validate stock symbol with delay
	const validateStockWithDelay = async (index, symbol) => {
		// Clear existing timeout for this index
		if (validationTimeouts.current[index]) {
			clearTimeout(validationTimeouts.current[index]);
		}

		// Set validating state
		setStocks(prev => {
			const updated = [...prev];
			updated[index] = { ...updated[index], validating: true, error: "" };
			return updated;
		});

		// Set timeout for validation
		validationTimeouts.current[index] = setTimeout(async () => {
			if (!symbol.trim()) {
				setStocks(prev => {
					const updated = [...prev];
					updated[index] = { ...updated[index], validating: false, valid: false, error: "" };
					return updated;
				});
				return;
			}

			try {
				const response = await validateStockSymbol(symbol.trim());
				
				if (response?.message?.includes("is valid") && response?.data?.symbol) {
					setStocks(prev => {
						const updated = [...prev];
						updated[index] = {
							...updated[index],
							symbol: response.data.symbol.toUpperCase(),
							valid: true,
							validating: false,
							error: ""
						};
						return updated;
					});
				} else {
					throw new Error("Invalid stock symbol");
				}
			} catch (error) {
				setStocks(prev => {
					const updated = [...prev];
					updated[index] = {
						...updated[index],
						valid: false,
						validating: false,
						error: error.message || "Invalid stock symbol"
					};
					return updated;
				});
			}
		}, 1000); // 1 second delay
	};

	const addStock = async () => {
		const lastStock = stocks[stocks.length - 1];

		if (!lastStock.symbol.trim()) {
			showError("Please enter a stock symbol.");
			return;
		}

		if (!lastStock.valid) {
			showError("Please wait for stock validation to complete.");
			return;
		}

		setStocks([
			...stocks,
			{ symbol: "", note: "", targetPrice: "", valid: false, validating: false, error: "" },
		]);

		setTimeout(() => {
			const inputs = document.querySelectorAll(
				"input[placeholder*='Symbol']"
			);
			if (inputs.length > 0) {
				inputs[inputs.length - 1].focus();
			}
		}, 50);
	};

	const handleStockChange = (index, field, value) => {
		const updated = [...stocks];
		updated[index][field] = value;

		if (field === "symbol") {
			updated[index].valid = false;
			updated[index].error = "";
			// Trigger auto-validation
			validateStockWithDelay(index, value);
		}

		setStocks(updated);
	};

	const removeStock = (index) => {
		// Clear timeout for this index
		if (validationTimeouts.current[index]) {
			clearTimeout(validationTimeouts.current[index]);
			delete validationTimeouts.current[index];
		}
		setStocks(stocks.filter((_, i) => i !== index));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!name.trim()) {
			showError("Watchlist name is required.");
			return;
		}

		const nonEmptyStocks = stocks.filter(
			(s) => s.symbol.trim() || s.note.trim() || s.targetPrice.trim()
		);

		for (const stock of nonEmptyStocks) {
			if (!stock.symbol.trim()) {
				showError("Each stock must have a symbol.");
				return;
			}

			if (!stock.valid) {
				showError(`Stock ${stock.symbol} is invalid or still validating.`);
				return;
			}
		}

		const newWatchlist = {
			name,
			stocks: nonEmptyStocks,
		};

		mutate(newWatchlist); 
	};

	const resetForm = () => {
		// Clear all timeouts
		Object.values(validationTimeouts.current).forEach(timeout => {
			clearTimeout(timeout);
		});
		validationTimeouts.current = {};
		
		setName("");
		setStocks([{ symbol: "", note: "", targetPrice: "", valid: false, validating: false, error: "" }]);
	};

	// Cleanup timeouts on unmount
	useEffect(() => {
		return () => {
			Object.values(validationTimeouts.current).forEach(timeout => {
				clearTimeout(timeout);
			});
		};
	}, []);

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<Card className="bg-[var(--background-100)] dark:bg-[var(--background-200)] border-[var(--background-200)] dark:border-[var(--background-300)] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<CardHeader className="border-b border-[var(--background-200)] dark:border-[var(--background-300)]">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-lg flex items-center justify-center">
								<FolderPlus className="w-5 h-5 text-white" />
							</div>
							<div>
								<CardTitle className="text-xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
									Create New Watchlist
								</CardTitle>
								<p className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)] mt-1">
									Build your portfolio with stocks you want to track
								</p>
							</div>
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => {
								resetForm();
								onClose();
							}}
							className="text-[var(--text-500)] dark:text-[var(--text-400)] hover:text-[var(--text-700)] dark:hover:text-[var(--text-200)]"
						>
							<X className="w-5 h-5" />
						</Button>
					</div>
				</CardHeader>

				<CardContent className="p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Watchlist Name */}
						<div className="space-y-2">
							<Label htmlFor="name" className="text-[var(--text-700)] dark:text-[var(--text-300)] font-medium">
								Watchlist Name *
							</Label>
							<Input
								id="name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter watchlist name"
								className="bg-[var(--background-50)] dark:bg-[var(--background-100)] border-[var(--background-300)] dark:border-[var(--background-400)] focus:border-[var(--primary-500)] dark:focus:border-[var(--primary-400)] focus:ring-[var(--primary-500)] dark:focus:ring-[var(--primary-400)]"
								required
							/>
						</div>

						{/* Stocks Section */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Label className="text-[var(--text-700)] dark:text-[var(--text-300)] font-medium">
									Stocks (Optional)
								</Label>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addStock}
									disabled={validating || stocks.some(s => s.validating)}
									className="border-[var(--background-300)] dark:border-[var(--background-400)] text-[var(--text-700)] dark:text-[var(--text-300)] hover:bg-[var(--background-200)] dark:hover:bg-[var(--background-300)]"
								>
									<Plus className="w-4 h-4 mr-2" />
									Add Stock
								</Button>
							</div>

							<div className="space-y-4">
								{stocks.map((stock, index) => (
									<Card
										key={index}
										className={`bg-[var(--background-50)] dark:bg-[var(--background-100)] border-[var(--background-200)] dark:border-[var(--background-300)] ${
											stock.symbol && stock.valid
												? "border-green-300 dark:border-green-600"
												: stock.symbol && !stock.valid && stock.error
												? "border-red-300 dark:border-red-600"
												: ""
										}`}
									>
										<CardContent className="p-4 space-y-4">
											{/* Symbol and Target Price Row */}
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">
														Symbol *
													</Label>
													<div className="relative">
														<TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-500)] dark:text-[var(--text-400)]" />
														<Input
															type="text"
															placeholder="e.g., AAPL"
															className={`pl-10 pr-10 bg-[var(--background-100)] dark:bg-[var(--background-200)] border-[var(--background-300)] dark:border-[var(--background-400)] focus:border-[var(--primary-500)] dark:focus:border-[var(--primary-400)] focus:ring-[var(--primary-500)] dark:focus:ring-[var(--primary-400)] ${
																stock.symbol && stock.valid
																	? "border-green-400 dark:border-green-500"
																	: stock.symbol && !stock.valid && stock.error
																	? "border-red-400 dark:border-red-500"
																	: ""
															}`}
															value={stock.symbol}
															onChange={(e) =>
																handleStockChange(
																	index,
																	"symbol",
																	e.target.value.toUpperCase()
																)
															}
															onKeyDown={(e) => {
																if (e.key === "Enter") {
																	e.preventDefault();
																	addStock();
																}
															}}
														/>
														{/* Validation Status Icon */}
														<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
															{stock.validating && (
																<Loader2 className="w-4 h-4 animate-spin text-[var(--primary-500)]" />
															)}
															{stock.valid && !stock.validating && (
																<CheckCircle className="w-4 h-4 text-green-500" />
															)}
															{stock.error && !stock.validating && (
																<AlertCircle className="w-4 h-4 text-red-500" />
															)}
														</div>
													</div>
													{/* Error Message */}
													{stock.error && (
														<p className="text-xs text-red-500 dark:text-red-400 mt-1">
															{stock.error}
														</p>
													)}
													{/* Validation Info */}
													{stock.symbol && !stock.valid && !stock.validating && !stock.error && (
														<p className="text-xs text-[var(--text-500)] dark:text-[var(--text-400)] mt-1">
															Validating symbol...
														</p>
													)}
												</div>

												<div className="space-y-2">
													<Label className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">
														Target Price
													</Label>
													<div className="relative">
														<DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-500)] dark:text-[var(--text-400)]" />
														<Input
															type="number"
															step="0.01"
															placeholder="0.00"
															className="pl-10 bg-[var(--background-100)] dark:bg-[var(--background-200)] border-[var(--background-300)] dark:border-[var(--background-400)] focus:border-[var(--primary-500)] dark:focus:border-[var(--primary-400)] focus:ring-[var(--primary-500)] dark:focus:ring-[var(--primary-400)]"
															value={stock.targetPrice}
															onChange={(e) =>
																handleStockChange(
																	index,
																	"targetPrice",
																	e.target.value
																)
															}
														/>
													</div>
												</div>
											</div>

											{/* Note Row */}
											<div className="space-y-2">
												<Label className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">
													Note
												</Label>
												<div className="relative">
													<FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-500)] dark:text-[var(--text-400)]" />
													<Input
														type="text"
														placeholder="Add a note about this stock..."
														className="pl-10 bg-[var(--background-100)] dark:bg-[var(--background-200)] border-[var(--background-300)] dark:border-[var(--background-400)] focus:border-[var(--primary-500)] dark:focus:border-[var(--primary-400)] focus:ring-[var(--primary-500)] dark:focus:ring-[var(--primary-400)]"
														value={stock.note}
														onChange={(e) =>
															handleStockChange(
																index,
																"note",
																e.target.value
															)
														}
													/>
												</div>
											</div>

											{/* Remove Button */}
											{stocks.length > 1 && (
												<div className="flex justify-end">
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={() => removeStock(index)}
														className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
													>
														<Trash2 className="w-4 h-4 mr-2" />
														Remove
													</Button>
												</div>
											)}
										</CardContent>
									</Card>
								))}
							</div>
						</div>

						{/* Error Message */}
						{isError && (
							<div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
								<p className="text-red-600 dark:text-red-400 text-sm">
									{error?.response?.data?.message ||
										error?.message ||
										"Something went wrong"}
								</p>
							</div>
						)}

						{/* Submit Button */}
						<div className="flex gap-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									resetForm();
									onClose();
								}}
								className="flex-1 border-[var(--background-300)] dark:border-[var(--background-400)] text-[var(--text-700)] dark:text-[var(--text-300)] hover:bg-[var(--background-200)] dark:hover:bg-[var(--background-300)]"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={
									isLoading ||
									!name.trim() ||
									stocks.some((s) => s.symbol && !s.valid) ||
									stocks.some((s) => s.validating)
								}
								className="flex-1 bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] hover:from-[var(--primary-600)] hover:to-[var(--accent-600)] text-white shadow-lg"
							>
								{isLoading ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Creating...
									</>
								) : (
									<>
										<FolderPlus className="w-4 h-4 mr-2" />
										Create Watchlist
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default CreateWatchlist;
