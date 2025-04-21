import { useState } from "react";
import { XCircleIcon } from "lucide-react";
import { CreateAWatchlist } from "@/api/watchlist";
import { showSuccess, showError } from "@/utils/toast";
import useStore from "@/context/Store";

const CreateWatchlist = ({ onClose }) => {
	const [name, setName] = useState("");
	const [stocks, setStocks] = useState([]); // <-- allow no initial stock

	const { watchlists ,addWatchlist, setWatchlists } = useStore();

	const addStock = () => {
		//Only allow new stock if previous stock has atleast symbol
		if (stocks.length > 0 && !stocks[stocks.length - 1].symbol) {
			showError("Please add a stock before adding a new one.");	
			return
		};

		
		setStocks([...stocks, { symbol: "", note: "", targetPrice: "" }]);
	};

	const removeStock = (index) => {
		setStocks(stocks.filter((_, i) => i !== index));
	};

	const handleStockChange = (index, field, value) => {
		const updated = [...stocks];
		updated[index][field] = value;
		setStocks(updated);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!name) {
			showError("Watchlist name is required.");
			return;
		}

		try {
			const createdWatchlist = await CreateAWatchlist(name, stocks);

			addWatchlist(createdWatchlist.watchlist);
			setWatchlists([...watchlists, createdWatchlist.watchlist]);
			showSuccess(
				createdWatchlist.message || "Watchlist created successfully."
			);

			resetForm();
			onClose();
		} catch (error) {
			console.error("Error creating watchlist:", error);
			showError(error.message || "Failed to create watchlist.");
		}
	};

	const resetForm = () => {
		setName("");
		setStocks([{ symbol: "", note: "", targetPrice: "" }]);
	};


	return (
		<form
			onSubmit={handleSubmit(e)}
			className="bg-[var(--secondary-50)] shadow-2xl rounded-2xl  p-5 flex flex-col gap-3 w-[50%] min-w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[var(--text-950)] border border-[var(--background-600)] z-50"
		>
			<div>
				<h2 className="text-xl font-bold text-center">
					Create New Watchlist
				</h2>
				<XCircleIcon
					className=" top-2 right-2 cursor-pointer mt-2 mr-2"
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

			{/* Stock Inputs */}
			<div className="flex flex-col gap-2">
				<label className="text-md font-bold">Stocks (Optional)</label>
				{stocks.map((stock, index) => (
					<div
						key={index}
						className="flex flex-col gap-3 bg-[var(--accent-100)] p-4 rounded-xl shadow-md"
					>
						<div className="flex gap-2">
							<input
								type="text"
								placeholder="Symbol (e.g. AAPL)"
								className="inputField flex-1"
								value={stock.symbol}
								onChange={(e) =>
									handleStockChange(
										index,
										"symbol",
										e.target.value
									)
								}
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

							{stocks.length > 0 && (
								<button
									type="button"
									onClick={() => removeStock(index)}
									className="text-red-500 hover:text-red-600 font-bold text-lg px-"
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
					className="button-primary mt-2"
				>
					+ Add another stock
				</button>
			</div>

			<button type="submit" className="formButton">
				Create Watchlist
			</button>
		</form>
	);
};

export default CreateWatchlist;
