import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import WatchlistPage from "../pages/WatchlistPage";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/Layout";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "login",
				element: <LoginPage />,
			},
			{
				path: "register",
				element: <RegisterPage />,
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
								path: "watchlist/:watchlistId",
								element: <WatchlistPage />,
							},
						],
					},
				],
			},
		],
	},
]);
