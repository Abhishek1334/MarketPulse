import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, LogOut, X, User, BarChart3, PieChart } from "lucide-react";
import { gsap } from "gsap";
import useStore from "../context/Store";
import StockSearchBar from "./StockSearchBar";
import ThemeToggle from "./ThemeToggle";
import { useAnalyticsStore } from "@/context/AnalyticsStore";
import Icon from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Navbar() {
	const [isSearchExpanded, setIsSearchExpanded] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user, logout } = useStore();
	const navigate = useNavigate();
	const location = useLocation();
	const { SearchStock, setSearchStock } = useAnalyticsStore();
	const navRef = useRef(null);
	const menuRef = useRef(null);

	useEffect(() => {
		// GSAP entrance animation
		const ctx = gsap.context(() => {
			gsap.fromTo(".nav-container", {
				y: -100,
				opacity: 0
			}, {
				y: 0,
				opacity: 1,
				duration: 0.8,
				ease: "power3.out"
			});
		}, navRef);

		return () => ctx.revert();
	}, []);

	useEffect(() => {
		// Mobile menu animation
		if (isMenuOpen) {
			gsap.fromTo(".mobile-menu", {
				opacity: 0,
				y: -20
			}, {
				opacity: 1,
				y: 0,
				duration: 0.3,
				ease: "power2.out"
			});
		}
	}, [isMenuOpen]);

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

	const isActiveRoute = (path) => {
		return location.pathname === path;
	};
	
	return (
		<nav ref={navRef} className="sticky top-0 z-50 bg-[var(--background-100)]/95 backdrop-blur-lg border-b border-[var(--background-200)] shadow-sm ">
			<div className="nav-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo Section */}
					<div className={`flex items-center ${isSearchExpanded ? "hidden md:flex" : "flex"}`}>
						<Link
							to={user ? "/dashboard" : "/"}
							className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200"
						>
							<div className="relative">
								<Icon iconSize="10" className="group-hover:rotate-12 transition-transform duration-300" />
								<div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-pulse"></div>
							</div>
							<span className="font-bold text-2xl text-[var(--primary-600)] dark:text-[var(--primary-300)]">MarketPulse</span>
						</Link>
					</div>

					{/* Search Bar Section */}
					<div className={`flex-1 flex items-center justify-center max-w-2xl mx-8 ${
				isSearchExpanded
							? "absolute left-0 right-0 top-0 bg-[var(--background-100)]/95 backdrop-blur-lg h-16 px-4 z-50 border-b border-[var(--background-200)]" 
					: ""
					}`}>
						<div className={`w-full transition-all duration-300 ${
							isSearchExpanded ? "flex" : "hidden md:flex max-w-md"
						}`}>
							<StockSearchBar
								onSelect={handleStockSelect}
								isExpanded={isSearchExpanded}
								onClose={() => setIsSearchExpanded(false)}
								className="w-full"
							/>
						</div>
					</div>

					{/* Right Section */}
					<div className={`flex items-center space-x-4 max-sm:space-x-0 ${isSearchExpanded ? "hidden md:flex" : "flex"}`}>
						{/* Theme Toggle */}
						<ThemeToggle />

						{/* Mobile Search Toggle */}
						<Button
							onClick={toggleSearch}
							variant="ghost"
							size="icon"
							className="md:hidden hover:bg-[var(--background-200)] transition-colors duration-200"
						>
							{isSearchExpanded ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
						</Button>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-2">
							{user ? (
								<div className="flex items-center space-x-2">
									{location.pathname !== "/dashboard" && (
										<Link to="/dashboard">
											<Button 
												variant={isActiveRoute("/dashboard") ? "default" : "ghost"}
												className={`${
													isActiveRoute("/dashboard") 
														? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg" 
														: "hover:bg-[var(--background-200)]"
												} transition-all duration-200`}
											>
												<BarChart3 className="w-4 h-4 mr-2" />
												Dashboard
											</Button>
										</Link>
									)}
									
									{location.pathname !== "/portfolio" && (
										<Link to="/portfolio">
											<Button 
												variant={isActiveRoute("/portfolio") ? "default" : "ghost"}
												className={`${
													isActiveRoute("/portfolio") 
														? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg" 
														: "hover:bg-[var(--background-200)]"
												} transition-all duration-200`}
											>
												<PieChart className="w-4 h-4 mr-2" />
												Portfolio
											</Button>
										</Link>
									)}
									
									<div className="flex items-center space-x-2 px-3 py-2 bg-[var(--background-200)] rounded-lg">
										<div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
											<User className="w-4 h-4 text-[var(--text-950)] dark:text-white" />
										</div>
										<span className="text-[var(--text-900)] dark:text-[var(--text-50)]">Welcome back, {user?.name}</span>
									</div>

									<Button
										onClick={handleLogout}
										variant="ghost"
										className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
									>
										<LogOut className="w-4 h-4 mr-2" />
										Logout
									</Button>
								</div>
							) : (
								<div className="flex items-center space-x-2">
									<Link to="/login">
										<Button variant="ghost" className="hover:bg-[var(--background-200)]">
										Login
										</Button>
									</Link>
									<Link to="/register">
										<Button className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white shadow-lg">
										Sign Up
										</Button>
									</Link>
								</div>
							)}
						</div>

						{/* Mobile Menu Toggle */}
						<Button
							onClick={toggleMenu}
							variant="ghost"
							size="icon"
							className="md:hidden hover:bg-[var(--background-200)] transition-colors duration-200"
						>
							{isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</Button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div ref={menuRef} className="mobile-menu md:hidden border-t border-[var(--background-200)] bg-[var(--background-100)]/95 backdrop-blur-lg">
						<div className="px-4 py-4 space-y-3">
							{user ? (
								<>
									{location.pathname !== "/dashboard" && (
										<Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
											<Button 
												variant="ghost" 
												className="w-full justify-start hover:bg-[var(--background-200)]"
											>
												<BarChart3 className="w-4 h-4 mr-3" />
												Dashboard
											</Button>
										</Link>
									)}
									
									{location.pathname !== "/portfolio" && (
										<Link to="/portfolio" onClick={() => setIsMenuOpen(false)}>
											<Button 
												variant="ghost" 
												className="w-full justify-start hover:bg-[var(--background-200)]"
											>
												<PieChart className="w-4 h-4 mr-3" />
												Portfolio
											</Button>
										</Link>
									)}
									
									<div className="flex items-center space-x-3 px-3 py-2 bg-[var(--background-200)] rounded-lg">
										<div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
											<User className="w-4 h-4 text-[var(--text-950)] dark:text-white" />
										</div>
										<span className="text-[var(--text-900)] dark:text-[var(--text-50)] text-sm">Welcome back, {user?.name}</span>
									</div>

									<Button
										onClick={handleLogout}
										variant="ghost"
										className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
									>
										<LogOut className="w-4 h-4 mr-3" />
										Logout
									</Button>
								</>
							) : (
								<div className="space-y-3">
									<Link to="/login" onClick={() => setIsMenuOpen(false)}>
										<Button variant="ghost" className="w-full justify-start hover:bg-[var(--background-200)]">
											Login
										</Button>
									</Link>
									<Link to="/register" onClick={() => setIsMenuOpen(false)}>
										<Button className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white shadow-lg">
											Sign Up
										</Button>
									</Link>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
