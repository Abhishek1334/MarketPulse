import { useState } from "react";
import { XCircleIcon } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import useStore from "@/context/Store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { validateStockSymbol } from "@/utils/validateStockSymbol";
import { CreateAWatchlist } from "@/api/watchlist";

const CreateWatchlist = ({ onClose }) => {
	const [name, setName] = useState("");
	const [stocks, setStocks] = useState([
		{ symbol: "", note: "", targetPrice: "", valid: false },
	]);
	const [validating, setValidating] = useState(false);
	const queryClient = useQueryClient();
	const { addWatchlist } = useStore(); 

	
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



	const addStock = async () => {
		const lastStock = stocks[stocks.length - 1];

		if (!lastStock.symbol.trim()) {
			showError("Please enter a stock symbol.");
			return;
		}

		setValidating(true);

		try {
			const response = await validateStockSymbol(lastStock.symbol);
			if (response && response.symbol) {
				const updated = [...stocks];
				updated[stocks.length - 1].valid = true;
				setStocks([
					...updated,
					{ symbol: "", note: "", targetPrice: "", valid: false },
				]);
				setTimeout(() => {
					const inputs = document.querySelectorAll(
						"input[placeholder^='Symbol']"
					);
					if (inputs.length > 0) {
						inputs[inputs.length - 1].focus();
					}
				}, 50);
				
			} else {
				throw new Error("Invalid stock symbol.");
			}
		} catch (error) {
			showError(error.message || "Invalid stock symbol.");
		}

		setValidating(false);
	};

	const handleStockChange = (index, field, value) => {
		const updated = [...stocks];
		updated[index][field] = value;

		if (field === "symbol") {
			updated[index].valid = false; // Reset validity on symbol change
		}

		setStocks(updated);
	};

	const removeStock = (index) => {
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
				showError(`Stock ${stock.symbol} is invalid.`);
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
		setName("");
		setStocks([{ symbol: "", note: "", targetPrice: "", valid: false }]);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-[var(--secondary-50)] shadow-2xl rounded-2xl p-5 flex flex-col gap-3 w-[50%]  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[var(--text-950)] border border-[var(--background-600)] z-50
			max-md:p-4 max-md:w-[60%] max-sm:w-[80%]" 
		>
			<div className="flex justify-between gap-3">
				<h2 className="text-lg font-bold ">
					Create New Watchlist
				</h2>
				<XCircleIcon
					className="top-2 right-2 cursor-pointer mt-1 mr-2"
					onClick={() => {
						resetForm();
						onClose();
					}}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<label className="text-md font-bold">Watchlist Name</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Enter watchlist name"
					className="inputField"
					required
				/>
			</div>

			<div className="flex flex-col  gap-2">
				<label className="text-md font-bold">Stocks (Optional)</label>
				{stocks.map((stock, index) => (
					<div
						key={index}
						className="flex flex-col  gap-3 bg-[var(--accent-100)] p-4 rounded-xl shadow-md"
					>
						<div className="flex gap-2 flex-wrap">
							<input
								type="text"
								placeholder="Symbol (e.g. AAPL)"
								className={`inputField flex-1 ${
									stock.symbol
										? stock.valid
											? "border-green-400"
											: "border-red-400"
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
							<input
								type="number"
								step="0.01"
								placeholder="Target Price"
								className="inputField flex-1"
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
						<div className="flex items-center gap-3">
							<input
								type="text"
								placeholder="Note..."
								className="inputField flex-1"
								value={stock.note}
								onChange={(e) =>
									handleStockChange(
										index,
										"note",
										e.target.value
									)
								}
							/>
							{stocks.length > 1 && (
								<button
									type="button"
									onClick={() => removeStock(index)}
									className="text-red-500 hover:text-red-600 font-bold text-lg"
								>
									×
								</button>
							)}
						</div>
					</div>
				))}
				<button
					type="button"
					onClick={addStock}
					className="formButton"
					disabled={validating}
				>
					{validating ? "Validating..." : "Add Stock"}
				</button>
			</div>

			<button
				type="submit"
				className={`formButton ${
					isLoading ? "opacity-50 cursor-not-allowed" : ""
				}`}
				disabled={
					isLoading ||
					!name.trim() ||
					stocks.some((s) => s.symbol && !s.valid)
				}
			>
				{isLoading ? "Creating..." : "Create Watchlist"}
			</button>

			{isError && (
				<div className="text-red-500 mt-2">
					{error?.response?.data?.message ||
						error?.message ||
						"Something went wrong"}
				</div>
			)}
		</form>
	);
};

export default CreateWatchlist;
