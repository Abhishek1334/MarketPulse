import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import WatchlistPage from "../pages/WatchlistPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import PortfolioPage from "../pages/PortfolioPage";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/Homepage";
import Layout from "../components/Layout";
import NotFoundPage from "@/pages/NotFoundPage";
export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <HomePage />,
			},
			{
				path: "login",
				element: <LoginPage />,
			},
			{
				path: "register",
				element: <RegisterPage />,
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},
			{
				element: <ProtectedRoute />, // Protect the routes that require authentication
				children: [
					{
						element: <Layout />, // Layout for the dashboard and watchlist pages
						children: [
							{
								path: "dashboard",
								element: <DashboardPage />,
							},
							{
								path: "portfolio",
								element: <PortfolioPage />,
							},
							{
								path: "watchlist/:watchlistId",
								element: <WatchlistPage />,
							},
							{
								path: "stocks/:symbol",
								element: <AnalyticsPage />,
							},
							{
								path: "search/:symbol",
								element: <AnalyticsPage />,
							},
						],
					},
				],
			},
		],
	},
]);
