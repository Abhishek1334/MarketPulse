import React from 'react';
import PortfolioPerformance from '../components/Portfolio/PortfolioPerformance';

const PortfolioPage = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-[var(--background-50)] to-[var(--background-100)] dark:from-[var(--background-50)] dark:to-[var(--background-100)] transition-all duration-300">
			<PortfolioPerformance />
		</div>
	);
};

export default PortfolioPage; 