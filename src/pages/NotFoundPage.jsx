import React from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../context/Store'
import { Button } from '@/components/ui/button'

const NotFoundPage = () => {

	const navigate = useNavigate()

	const { user } = useStore()

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			
			<h1
				style={{ fontSize: "3em", color: "#333", marginBottom: "10px" }}
			>
				404 - Page Not Found
			</h1>
			<p
				style={{
					fontSize: "1.2em",
					color: "#666",
					marginBottom: "20px",
					textAlign: "center",
				}}
			>
				Oops! The page you are looking for does not exist.
			</p>
			<Button
				onClick={() => navigate(user ? "/dashboard" : "/login")}
				className="font-[Raleway] border-2 border-[var(--background-50)] px-3 py-2 rounded-2xl text-base font-semibold text-[var(--background-50)]"
			>
				Go to Login
			</Button>
		</div>
	);
}

export default NotFoundPage