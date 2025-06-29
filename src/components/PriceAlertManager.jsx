import React, { useEffect } from 'react';
import priceAlertService from '@/service/PriceAlertService';
import { showSuccess, showError } from '@/utils/toast';

const PriceAlertManager = () => {
	useEffect(() => {
		// Start monitoring alerts when component mounts
		priceAlertService.startMonitoring((alertData) => {
			// Show toast notification when alert is triggered
			showSuccess(alertData.message, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		});

		// Cleanup when component unmounts
		return () => {
			priceAlertService.stopMonitoring();
		};
	}, []);

	// This component doesn't render anything visible
	return null;
};

export default PriceAlertManager; 