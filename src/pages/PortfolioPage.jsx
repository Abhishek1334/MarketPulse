import React, { useEffect } from 'react';
import PortfolioPerformance from '../components/Portfolio/PortfolioPerformance';
import useStore from '@/context/Store';

const PortfolioPage = () => {
	const migrateLocalPortfolio = useStore((s) => s.migrateLocalPortfolio);
	const loadPortfolio = useStore((s) => s.loadPortfolio);

	useEffect(() => {
		(async () => {
			await migrateLocalPortfolio();
			await loadPortfolio();
		})();
	}, [migrateLocalPortfolio, loadPortfolio]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-[var(--background-50)] to-[var(--background-100)] dark:from-[var(--background-50)] dark:to-[var(--background-100)] transition-all duration-300">
			<PortfolioPerformance />
		</div>
	);
};

export default PortfolioPage;
