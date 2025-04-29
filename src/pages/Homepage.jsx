import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/Icon'
const Homepage = () => {
	const navigate = useNavigate()

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<Icon
				iconSize="50"
				iconColor="light"
				className="mb-4 animate-pulse"
			/>

			<h1
				style={{ fontSize: "3em", color: "#333", marginBottom: "10px" }}
			>
				Welcome to MarketPulse
			</h1>
			<p
				style={{
					fontSize: "1.2em",
					color: "#666",
					marginBottom: "20px",
					textAlign: "center",
				}}
			>
				Your trusted source for stock information and analysis.
			</p>
			<button
				onClick={() => navigate("/login")}
				className="font-[Raleway] border-2 border-[var(--background-100)] px-3 py-2 rounded-2xl text-lg font-medium text-[var(--background-900)]
				hover:bg-[var(--background-100)] hover:text-[var(--background-900)] transition-colors animate-pulse"
			>
				Get Started
			</button>
		</div>
	);
}

export default Homepage