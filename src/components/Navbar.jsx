import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import useStore from "../context/Store";
import StockSearchBar from "./StockSearchBar";
import ThemeToggle from "./ThemeToggle";
import { useAnalyticsStore } from "@/context/AnalyticsStore";
export default function Navbar() {
	const [isSearchExpanded, setIsSearchExpanded] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user, logout } = useStore();
	const navigate = useNavigate();
	const { SearchStock, setSearchStock} = useAnalyticsStore();
	const handleLogout = async () => {
		try {
			await logout();
			navigate("/login");
		} catch (error) {
			console.error("Failed to log out:", error);
		}
	};

	const toggleSearch = () => {
		setIsSearchExpanded(!isSearchExpanded);
		if (!isSearchExpanded) {
			setIsMenuOpen(false);
		}
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
		if (!isMenuOpen) {
			setIsSearchExpanded(false);
		}
	};

	const handleStockSelect = (stock) => {
		setSearchStock(stock.symbol);
		navigate(`search/${stock.symbol}`);
		setIsSearchExpanded(false);
	};

	
	return (
		<nav className="bg-[var(--background-100)] ">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					{/* Logo - Hidden on mobile when search is expanded */}
					<div
						className={`flex items-center justify-between w-full gap-10 max-md:gap-5 ${
							isSearchExpanded ? "hidden md:flex" : "flex"
						}`}
					>
						<Link to="/" className="flex items-center space-x-2">
							<span className="text-2xl font-bold text-[var(--text-950)]">
								MarketPulse
							</span>
						</Link>
						<ThemeToggle />
					</div>

					{/* Search Bar */}
					<div
						className={`flex-1 flex items-center justify-center max-w-2xl mx-4 
            ${
				isSearchExpanded
					? "absolute left-0 right-0 top-0 bg-[var(--background-100)] h-16 px-4 z-50"
					: ""
			}`}
					>
						<div
							className={`w-full md:w-96 ${
								isSearchExpanded ? "flex" : "hidden md:flex"
							}`}
						>
							<StockSearchBar
								onSelect={handleStockSelect}
								isExpanded={isSearchExpanded}
								onClose={() => setIsSearchExpanded(false)}
								className="w-full"
							/>
						</div>
					</div>

					{/* Mobile Search Toggle and Menu */}
					<div
						className={`flex items-center space-x-4 ${
							isSearchExpanded ? "hidden md:flex" : "flex"
						}`}
					>
						<button
							onClick={toggleSearch}
							className="md:hidden p-2 text-[var(--text-950)] hover:text-[var(--text-900)]"
						>
							<Search className="h-5 w-5" />
						</button>

						<button
							onClick={toggleMenu}
							className="md:hidden p-2 text-[var(--text-950)] hover:text-[var(--text-900)]"
						>
							<Menu className="h-5 w-5" />
						</button>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-4">
							{user ? (
								<>
									<Link to="/dashboard" className="nav-link">
										Dashboard
									</Link>
									<button
										onClick={handleLogout}
										className="nav-link"
									>
										Logout
									</button>
								</>
							) : (
								<>
									<Link to="/login" className="btn-secondary">
										Login
									</Link>
									<Link to="/signup" className="btn-primary">
										Sign Up
									</Link>
								</>
							)}
						</div>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="md:hidden border-t border-gray-50/10">
						<div className="py-2 space-y-1 text-sm font-semibold">
							{user ? (
								<>
									<Link
										to="/dashboard"
										className="block rounded-md px-4 py-2 text-[var(--text-950)] hover:bg-[var(--background-50)]"
									>
										Dashboard
									</Link>
									<button
										onClick={handleLogout}
										className="block w-full rounded-md  text-left px-4 py-2 text-red-500 hover:bg-[var(--background-50)]"
									>
										Logout
									</button>
								</>
							) : (
								<>
									<Link
										to="/login"
										className="block px-4 rounded-md  py-2 text-[var(--text-950)] hover:bg-[var(--background-50)]"
									>
										Login
									</Link>
									<Link
										to="/signup"
										className="block rounded-md  px-4 py-2 text-[var(--text-950)] hover:bg-[var(--background-50)]"
									>
										Sign Up
									</Link>
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
