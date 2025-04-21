import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import useStore from "../context/Store";
import { FaBars, FaTimes } from "react-icons/fa";
import { LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
	const navigate = useNavigate();
	const logout = useStore((state) => state.logout);
	const user = useStore((state) => state.user);

	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
	};

	const navLinkClass = ({ isActive }) =>
		`nav-link ${isActive ? "nav-link-active" : ""}`;

	return (
		<div className="bg-white shadow-md px-10 max-sm:px-4">
			<div className="flex justify-between items-center p-4">
				<NavLink to="/">
					<h1 className="text-2xl font-bold ml-2">MarketPulse</h1>
				</NavLink>

				{/* Hamburger for small screens */}
				<div className="sm:hidden flex items-center">
					<button onClick={toggleMenu} className="text-2xl">
						{isMenuOpen ? <FaTimes /> : <FaBars />}
					</button>
				</div>

				{/* Regular nav */}
				<div className="hidden sm:flex items-center gap-4 text-sm font-medium">
					<ThemeToggle />
					<NavLink to="/" className={navLinkClass}>
						Home
					</NavLink>
					{user ? (
						<>
							<NavLink to="/dashboard" className={navLinkClass}>
								Dashboard
							</NavLink>

							<button
								onClick={handleLogout}
								className="button-primary px-3"
							>
								<div>
									<LogOut />
								</div>
							</button>
						</>
					) : (
						<>
							<NavLink to="/login" className={navLinkClass}>
								Login
							</NavLink>
							<NavLink to="/register" className={navLinkClass}>
								Register
							</NavLink>
						</>
					)}
				</div>

				{/* Dropdown for small screens */}
				{isMenuOpen && (
					<div className="sm:hidden absolute top-16 left-0 w-full bg-white shadow-md p-4 space-y-2 z-50 text-sm font-medium flex flex-col">
						<NavLink
							to="/"
							className={navLinkClass}
							onClick={toggleMenu}
						>
							Home
						</NavLink>
						{user ? (
							<>
								<NavLink
									to="/dashboard"
									className={navLinkClass}
									onClick={toggleMenu}
								>
									Dashboard
								</NavLink>

								<button
									onClick={handleLogout}
									className="button-primary ml-2 "
								>
									Logout
								</button>
							</>
						) : (
							<>
								<NavLink
									to="/login"
									className={navLinkClass}
									onClick={toggleMenu}
								>
									Login
								</NavLink>
								<NavLink
									to="/register"
									className={navLinkClass}
									onClick={toggleMenu}
								>
									Register
								</NavLink>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Navbar;
