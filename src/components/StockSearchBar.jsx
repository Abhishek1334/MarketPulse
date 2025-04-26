import React, { useState, useRef, useEffect } from "react";
import { Search, X, Loader } from "lucide-react";
import { searchStocksfromExternalAPI } from "../api/analyse";

const StockSearchBar = ({ onSelect, isExpanded, onClose, className }) => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const searchRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target)
			) {
				setResults([]);
				if (onClose) onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

	const handleSearch = async (e) => {
		const val = e.target.value;
		setQuery(val);

		if (val.length > 1) {
			setIsLoading(true);
			try {
				const stocks = await searchStocksfromExternalAPI(val);
				setResults(stocks);
			} catch (error) {
				console.error("Search failed:", error);
			} finally {
				setIsLoading(false);
			}
		} else {
			setResults([]);
		}
	};

	const handleClear = () => {
		setQuery("");
		setResults([]);
	};

	const handleSelect = (stock) => {
		if (onSelect) {
			onSelect(stock);
			handleClear();
			if (onClose) onClose();
		}
	};

	return (
		<div ref={searchRef} className={`relative ${className}`}>
			<div className="relative flex items-center font-semibold">
				<div className="absolute left-3 flex  items-center pointer-events-none">
					<Search className="h-5 w-5 text-[var(--secondary-400)]" />
				</div>
				<input
					type="text"
					placeholder="Search stocks (e.g. AAPL, TSLA)"
					value={query}
					onChange={handleSearch}
					className="w-full pl-10 pr-10 py-2 rounded-lg border border-[var(--secondary-200)] 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-[var(--secondary-50)] placeholder-[var(--secondary-400)] text-[var(--text-950)]"
				/>
				<div className="absolute right-3 flex items-center space-x-2">
					{isLoading && (
						<Loader className="h-5 w-5 text-[var(--secondary-400)] animate-spin" />
					)}
					{query && (
						<button
							onClick={handleClear}
							className="text-[var(--secondary-400)] hover:text-[var(--secondary-500)]"
						>
							<X className="h-5 w-5" />
						</button>
					)}
				</div>
			</div>

			{results.length > 0 && (
				<div
					className="absolute top-full left-0 right-0 mt-1 bg-[var(--secondary-100)] scrollable-content rounded-lg shadow-lg border-1
					border-[var(--secondary-200)] max-h-60 overflow-y-auto z-50 font-semibold p-1 "
				>
					{results.map((stock) => (
						<button
							key={stock.symbol}
							onClick={() => handleSelect(stock)}
							className="w-full px-4 py-2 text-left hover:bg-[var(--secondary-100)] flex items-center justify-between"
						>
							<div>
								<div className="font-medium text-[var(--text-950)]">
									{stock.symbol}
								</div>
								<div className="text-sm text-[var(--text-600)]">
									{stock.shortname}
								</div>
							</div>
							<div className="text-xs bg-[var(--secondary-200)] text-purple-600 px-2 py-1 rounded">
								{stock.type || "Stock"}
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default StockSearchBar;
