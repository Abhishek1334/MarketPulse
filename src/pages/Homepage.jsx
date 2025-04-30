// src/app/page.tsx
import { Button } from "@/components/ui/button"; // Assuming you have a UI library like Shadcn/ui or similar
import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/Icon";

const Homepage = () => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
			{/* Replaced inline styles with Tailwind classes for consistency and maintainability */}
			<Icon
				iconSize="64" // Increased icon size
				iconColor="light"
				className="mb-6 animate-bounce" // Added bounce animation
			/>

			<h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
				Welcome to MarketPulse
			</h1>
			<p className="text-xl text-gray-700 dark:text-gray-300 text-center mb-8">
				Your trusted source for stock information and analysis.
			</p>
			<Button // Using a UI library component for consistent styling
				onClick={() => navigate("/login")}
				className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-6 py-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
			>
				Get Started
			</Button>
		</div>
	);
};

export default Homepage;
