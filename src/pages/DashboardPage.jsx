import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { getWatchlistsByUser } from "../api/watchlist";
import { showSuccess, showError } from "../utils/toast.jsx";
import Header from "../components/Dashboard/Header.jsx";
import SummaryCards from "../components/Dashboard/SummaryCards.jsx";
import Watchlist from "../components/Dashboard/Watchlist.jsx";
import { Plus, Sparkles, TrendingUp } from "lucide-react";
import CreateWatchlist from "../components/Dashboard/CreateWatchlist.jsx";
import useStore from "@/context/Store";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
	const { setWatchlists } = useStore();
	const dashboardRef = useRef(null);
	const [showForm, setShowForm] = useState(false);

	const {
		data: watchlists,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["watchlists"],
		queryFn: getWatchlistsByUser,
	});

	useEffect(() => {
		if (watchlists) {
			setWatchlists(watchlists);
		}
	}, [watchlists, setWatchlists]);

	useEffect(() => {
		if (isError && error?.message) {
			showError(error.message);
		}
	}, [isError, error]);

	// GSAP Animations
	useEffect(() => {
		const ctx = gsap.context(() => {
			// Animate dashboard sections
			gsap.fromTo(".dashboard-header", {
				y: -50,
				opacity: 0
			}, {
				y: 0,
				opacity: 1,
				duration: 0.8,
				ease: "power3.out"
			});

			gsap.fromTo(".dashboard-cards", {
				y: 30,
				opacity: 0
			}, {
				y: 0,
				opacity: 1,
				duration: 0.8,
				delay: 0.2,
				ease: "power3.out"
			});

			gsap.fromTo(".dashboard-content", {
				y: 50,
				opacity: 0
			}, {
				y: 0,
				opacity: 1,
				duration: 0.8,
				delay: 0.4,
				ease: "power3.out"
			});

			// Animate create button
			gsap.fromTo(".create-btn", {
				scale: 0,
				opacity: 0
			}, {
				scale: 1,
				opacity: 1,
				duration: 0.6,
				delay: 0.6,
				ease: "back.out(1.7)"
			});

		}, dashboardRef);

		return () => ctx.revert();
	}, []);

	if (isError) {
		return (
			<div className="flex h-[90vh] items-center justify-center">
				<Card className="p-8 text-center max-w-md bg-red-50/50 border-red-200">
					<CardContent>
						<div className="text-red-600 text-lg font-medium mb-2">⚠️ Something went wrong</div>
						<p className="text-red-500">{error.message}</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div ref={dashboardRef} className="min-h-screen bg-gradient-to-br from-[var(--background-50)] to-[var(--background-100)] px-4 py-6 md:px-8 md:py-10">
			{/* Create Watchlist Modal */}
			{showForm && (
				<CreateWatchlist onClose={() => setShowForm(false)} />
			)}

			{/* Hero Section */}
			<div className="dashboard-header mb-8">
				<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
					{/* Welcome Section */}
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-3">
							<div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-xl flex items-center justify-center">
								<TrendingUp className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-3xl md:text-4xl font-bold text-[var(--text-600)] dark:text-[var(--text-50)] leading-tight">
									Welcome back!
								</h1>
								<p className="text-[var(--text-600)] dark:text-[var(--text-300)] text-lg">
									Track your investments and discover opportunities
								</p>
							</div>
						</div>
					</div>

					{/* Create Watchlist Button */}
					<Button
						onClick={() => setShowForm(true)}
						size="lg"
						className="create-btn bg-gradient-to-r from-[var(--primary-600)] to-[var(--accent-600)] hover:from-[var(--primary-700)] hover:to-[var(--accent-700)] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
					>
						<Plus className="w-5 h-5 mr-2" />
						New Watchlist
						<Sparkles className="w-4 h-4 ml-2" />
					</Button>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
				{/* Header Section */}
				<div className="dashboard-cards xl:col-span-1">
					<Header />
				</div>

				{/* Summary Cards */}
				<div className="dashboard-cards xl:col-span-2">
					<SummaryCards loading={isLoading} />
				</div>
			</div>

			{/* Watchlists Section */}
			<div className="dashboard-content">
				<Card className="bg-[var(--background-50)]/80 backdrop-blur-sm border-[var(--background-200)] shadow-xl">
					<CardHeader className="pb-6">
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-2xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)] mb-2">
									Your Watchlists
								</CardTitle>
								<p className="text-[var(--text-600)] dark:text-[var(--text-300)]">
									Manage and monitor your stock portfolios
								</p>
							</div>
							{watchlists && watchlists.length > 0 && (
								<div className="text-sm text-[var(--text-500)] dark:text-[var(--text-300)] bg-[var(--background-200)] px-3 py-1 rounded-full">
									{watchlists.length} {watchlists.length === 1 ? 'watchlist' : 'watchlists'}
								</div>
							)}
						</div>
					</CardHeader>
					<CardContent>
						<Watchlist loading={isLoading} />
					</CardContent>
				</Card>
			</div>

			{/* Empty State Enhancement */}
			{!isLoading && (!watchlists || watchlists.length === 0) && (
				<div className="dashboard-content mt-8">
					<Card className="bg-gradient-to-br from-[var(--background-100)] to-[var(--background-200)] border-[var(--background-300)] text-center py-16">
						<CardContent>
							<div className="max-w-md mx-auto">
								<div className="w-20 h-20 bg-gradient-to-br from-[var(--primary-500)]/20 to-[var(--accent-500)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
									<TrendingUp className="w-10 h-10 text-[var(--primary-600)]" />
								</div>
								<h3 className="text-2xl font-bold text-[var(--text-950)] mb-4">
									Start Your Investment Journey
								</h3>
								<p className="text-[var(--text-600)] mb-8 leading-relaxed">
									Create your first watchlist to begin tracking stocks, analyzing trends, and making informed investment decisions.
								</p>
								<Button
									onClick={() => setShowForm(true)}
									size="lg"
									className="bg-gradient-to-r from-[var(--primary-600)] to-[var(--accent-600)] hover:from-[var(--primary-700)] hover:to-[var(--accent-700)] text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
								>
									<Plus className="w-5 h-5 mr-2" />
									Create Your First Watchlist
									<Sparkles className="w-4 h-4 ml-2" />
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
};

export default DashboardPage;
