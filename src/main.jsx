import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/index.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(


	<StrictMode>
			<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
					
			</QueryClientProvider>
	</StrictMode>
);
