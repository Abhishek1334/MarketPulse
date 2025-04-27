// Homepage.jsx - Fix the navigation handling
import React from "react";
import ActionButton from "@/components/Homepage/ActionButton";
import ChartAnimation from "@/components/Homepage/ChartAnimation";
import { TrendingUp, ChartBar, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Homepage/Logo";
const FeatureIcon = ({ icon, title, description }) => {
	return (
		<div className="flex flex-col items-center text-center p-4">
			<div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600">
				{icon}
			</div>
			<h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
			<p className="text-gray-600 text-sm">{description}</p>
		</div>
	);
};

const Homepage = () => {
	const navigate = useNavigate();
	const navigateTo = (path) => {

		return () => navigate(path);
	};

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<header className="flex justify-between items-center py-6">
					<Logo className="ml-4" />
					<div className="flex gap-4">
						<ActionButton
							variant="outline"
							onClick={navigateTo("login")}
						>
							Login
						</ActionButton>
						<ActionButton onClick={navigateTo("register")}>
							Sign Up
						</ActionButton>
					</div>
				</header>

				<main>
					<div className="py-12 md:py-20 flex flex-col md:flex-row items-center gap-8">
						<div className="md:w-1/2 space-y-6">
							<h1 className="text-4xl md:text-5xl font-bold text-gray-900">
								Stay Ahead of the Market
							</h1>
							<p className="text-xl text-gray-600">
								Real-time stock tracking, interactive analytics,
								and personalized watchlists in one powerful
								dashboard.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 pt-4">
								<ActionButton
									size="lg"
									onClick={navigateTo("/register")}
								>
									Sign Up
								</ActionButton>
								<ActionButton
									variant="outline"
									size="lg"
									onClick={navigateTo("/login")}
								>
									Login
								</ActionButton>
							</div>
						</div>
						<div className="md:w-1/2">
							<ChartAnimation />
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
						<FeatureIcon
							icon={<Search size={24} />}
							title="Stock Search"
							description="Find & track any stock instantly"
						/>
						<FeatureIcon
							icon={<ChartBar size={24} />}
							title="Advanced Charts"
							description="Interactive data visualization"
						/>
						<FeatureIcon
							icon={<TrendingUp size={24} />}
							title="Real-time Analytics"
							description="Live market performance"
						/>
						<FeatureIcon
							icon={<Users size={24} />}
							title="Custom Watchlists"
							description="Track your portfolio"
						/>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Homepage;
