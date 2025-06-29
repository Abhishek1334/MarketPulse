import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from './ui/button';

const BackButton = ({ locationAddress, locationName, showHome = false }) => {
	const navigate = useNavigate();

	const handleBack = () => {
		if (locationAddress) {
			navigate(locationAddress);
		} else {
			navigate(-1);
		}
	};

	const handleHome = () => {
		navigate('/dashboard');
	};

	return (
		<div className="flex items-center gap-3 mb-6">
			<Button
				onClick={handleBack}
				variant="outline"
				size="sm"
				className="bg-[var(--background-100)] dark:bg-[var(--background-200)] border-[var(--background-300)] dark:border-[var(--background-400)] text-[var(--text-700)] dark:text-[var(--text-300)] hover:bg-[var(--background-200)] dark:hover:bg-[var(--background-300)] hover:text-[var(--text-900)] dark:hover:text-[var(--text-100)] transition-all duration-200 ease-in-out shadow-sm"
			>
				<ArrowLeft className="w-4 h-4 mr-2" />
				{locationName || "Back"}
			</Button>
			
			{showHome && (
				<Button
					onClick={handleHome}
					variant="outline"
					size="sm"
					className="bg-[var(--background-100)] dark:bg-[var(--background-200)] border-[var(--background-300)] dark:border-[var(--background-400)] text-[var(--text-700)] dark:text-[var(--text-300)] hover:bg-[var(--background-200)] dark:hover:bg-[var(--background-300)] hover:text-[var(--text-900)] dark:hover:text-[var(--text-100)] transition-all duration-200 ease-in-out shadow-sm"
				>
					<Home className="w-4 h-4 mr-2" />
					Dashboard
				</Button>
			)}
		</div>
	);
};

export default BackButton; 