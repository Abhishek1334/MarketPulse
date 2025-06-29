// Enhanced Price Alert Service
// This service manages advanced price alerts using localStorage and provides real-time checking

class PriceAlertService {
	constructor() {
		this.alerts = this.loadAlerts();
		this.checkInterval = null;
		this.isRunning = false;
		this.notificationPermission = false;
		this.initNotifications();
	}

	// Initialize browser notifications
	async initNotifications() {
		if ('Notification' in window) {
			if (Notification.permission === 'granted') {
				this.notificationPermission = true;
			} else if (Notification.permission !== 'denied') {
				try {
					const permission = await Notification.requestPermission();
					this.notificationPermission = permission === 'granted';
				} catch (error) {
					console.error('Error requesting notification permission:', error);
				}
			}
		}
	}

	// Load alerts from localStorage
	loadAlerts() {
		try {
			const stored = localStorage.getItem('price-alerts');
			return stored ? JSON.parse(stored) : [];
		} catch (error) {
			console.error('Error loading price alerts:', error);
			return [];
		}
	}

	// Save alerts to localStorage
	saveAlerts() {
		try {
			localStorage.setItem('price-alerts', JSON.stringify(this.alerts));
		} catch (error) {
			console.error('Error saving price alerts:', error);
		}
	}

	// Add a new price alert with advanced options
	addAlert(alert) {
		const newAlert = {
			id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
			symbol: alert.symbol.toUpperCase(),
			alertType: alert.alertType, // 'above', 'below', 'percentage', 'volume', 'technical'
			targetPrice: parseFloat(alert.targetPrice) || 0,
			currentPrice: parseFloat(alert.currentPrice) || 0,
			percentageChange: parseFloat(alert.percentageChange) || 0,
			volumeThreshold: parseFloat(alert.volumeThreshold) || 0,
			technicalIndicator: alert.technicalIndicator || null,
			technicalValue: parseFloat(alert.technicalValue) || 0,
			createdAt: new Date().toISOString(),
			isActive: true,
			triggered: false,
			triggeredAt: null,
			note: alert.note || '',
			repeat: alert.repeat || false,
			repeatInterval: alert.repeatInterval || 'once', // 'once', 'daily', 'weekly'
			lastTriggered: null,
			priority: alert.priority || 'medium', // 'low', 'medium', 'high'
			email: alert.email || '',
			sound: alert.sound !== false, // default to true
			expiresAt: alert.expiresAt ? new Date(alert.expiresAt).toISOString() : null
		};

		this.alerts.push(newAlert);
		this.saveAlerts();
		return newAlert;
	}

	// Remove an alert
	removeAlert(alertId) {
		this.alerts = this.alerts.filter(alert => alert.id !== alertId);
		this.saveAlerts();
	}

	// Update an alert
	updateAlert(alertId, updates) {
		const alertIndex = this.alerts.findIndex(alert => alert.id === alertId);
		if (alertIndex !== -1) {
			this.alerts[alertIndex] = { ...this.alerts[alertIndex], ...updates };
			this.saveAlerts();
			return this.alerts[alertIndex];
		}
		return null;
	}

	// Get all alerts for a symbol
	getAlertsForSymbol(symbol) {
		return this.alerts.filter(alert => 
			alert.symbol === symbol.toUpperCase() && 
			alert.isActive && 
			!this.isAlertExpired(alert)
		);
	}

	// Get all active alerts
	getAllActiveAlerts() {
		return this.alerts.filter(alert => 
			alert.isActive && 
			!alert.triggered && 
			!this.isAlertExpired(alert)
		);
	}

	// Check if alert is expired
	isAlertExpired(alert) {
		if (!alert.expiresAt) return false;
		return new Date() > new Date(alert.expiresAt);
	}

	// Check if a price should trigger an alert
	checkPriceAlert(alert, currentPrice, currentVolume = null, technicalData = null) {
		if (alert.triggered || !alert.isActive || this.isAlertExpired(alert)) return false;

		// Check repeat conditions
		if (alert.repeat && alert.lastTriggered) {
			const lastTriggered = new Date(alert.lastTriggered);
			const now = new Date();
			
			if (alert.repeatInterval === 'daily') {
				const daysDiff = Math.floor((now - lastTriggered) / (1000 * 60 * 60 * 24));
				if (daysDiff < 1) return false;
			} else if (alert.repeatInterval === 'weekly') {
				const daysDiff = Math.floor((now - lastTriggered) / (1000 * 60 * 60 * 24));
				if (daysDiff < 7) return false;
			}
		}

		const price = parseFloat(currentPrice);
		const target = parseFloat(alert.targetPrice);

		switch (alert.alertType) {
			case 'above':
				return price >= target;
			
			case 'below':
				return price <= target;
			
			case 'percentage':
				const percentageChange = ((price - alert.currentPrice) / alert.currentPrice) * 100;
				return Math.abs(percentageChange) >= alert.percentageChange;
			
			case 'volume':
				if (!currentVolume) return false;
				return currentVolume >= alert.volumeThreshold;
			
			case 'technical':
				if (!technicalData || !alert.technicalIndicator) return false;
				const techValue = technicalData[alert.technicalIndicator];
				if (!techValue) return false;
				
				switch (alert.technicalIndicator) {
					case 'rsi':
						return alert.technicalValue > 50 ? techValue >= alert.technicalValue : techValue <= alert.technicalValue;
					case 'macd':
						return techValue >= alert.technicalValue;
					default:
						return techValue >= alert.technicalValue;
				}
			
			default:
				return false;
		}
	}

	// Update alert status
	markAlertTriggered(alertId) {
		const alert = this.alerts.find(a => a.id === alertId);
		if (alert) {
			alert.triggered = true;
			alert.triggeredAt = new Date().toISOString();
			alert.lastTriggered = new Date().toISOString();
			
			// Reset for repeat alerts
			if (alert.repeat) {
				alert.triggered = false;
			}
			
			this.saveAlerts();
		}
	}

	// Start monitoring alerts
	startMonitoring(callback) {
		if (this.isRunning) return;

		this.isRunning = true;
		this.checkInterval = setInterval(() => {
			this.checkAllAlerts(callback);
		}, 30000); // Check every 30 seconds
	}

	// Stop monitoring alerts
	stopMonitoring() {
		if (this.checkInterval) {
			clearInterval(this.checkInterval);
			this.checkInterval = null;
		}
		this.isRunning = false;
	}

	// Check all active alerts
	async checkAllAlerts(callback) {
		const activeAlerts = this.getAllActiveAlerts();
		
		for (const alert of activeAlerts) {
			try {
				// In a real app, you'd fetch current price, volume, and technical data from API
				const currentData = await this.getCurrentData(alert.symbol);
				
				if (this.checkPriceAlert(alert, currentData.price, currentData.volume, currentData.technical)) {
					this.markAlertTriggered(alert.id);
					
					// Show notification
					this.showNotification(alert, currentData);
					
					// Call the callback with alert details
					if (callback) {
						callback({
							alert,
							currentData,
							message: this.generateAlertMessage(alert, currentData)
						});
					}
				}
			} catch (error) {
				console.error(`Error checking alert for ${alert.symbol}:`, error);
			}
		}
	}

	// Get current data for a symbol (simulated)
	async getCurrentData(symbol) {
		// In a real app, this would fetch from your stock API
		// For now, we'll return simulated data
		const basePrice = 150; // Base price
		const variation = (Math.random() - 0.5) * 20; // ±$10 variation
		const price = (basePrice + variation).toFixed(2);
		
		const volume = Math.floor(Math.random() * 1000000) + 100000; // Random volume
		
		// Simulated technical indicators
		const technical = {
			rsi: Math.random() * 100,
			macd: (Math.random() - 0.5) * 10,
			sma: parseFloat(price) + (Math.random() - 0.5) * 5
		};

		return { price, volume, technical };
	}

	// Show browser notification
	showNotification(alert, currentData) {
		if (!this.notificationPermission || !alert.sound) return;

		try {
			const message = this.generateAlertMessage(alert, currentData);
			
			new Notification('MarketPulse Alert', {
				body: message,
				icon: '/public/True.svg',
				tag: alert.id,
				requireInteraction: alert.priority === 'high',
				badge: '/public/True.svg'
			});
		} catch (error) {
			console.error('Error showing notification:', error);
		}
	}

	// Generate alert message
	generateAlertMessage(alert, currentData) {
		const symbol = alert.symbol;
		const price = currentData.price;
		
		switch (alert.alertType) {
			case 'above':
				return `${symbol} has reached $${price} (above your target of $${alert.targetPrice})`;
			case 'below':
				return `${symbol} has reached $${price} (below your target of $${alert.targetPrice})`;
			case 'percentage':
				const change = ((price - alert.currentPrice) / alert.currentPrice) * 100;
				return `${symbol} has changed by ${change.toFixed(2)}% (target: ${alert.percentageChange}%)`;
			case 'volume':
				return `${symbol} volume has reached ${currentData.volume.toLocaleString()} (target: ${alert.volumeThreshold.toLocaleString()})`;
			case 'technical':
				return `${symbol} ${alert.technicalIndicator?.toUpperCase()} has reached ${currentData.technical[alert.technicalIndicator]} (target: ${alert.technicalValue})`;
			default:
				return `${symbol} alert triggered at $${price}`;
		}
	}

	// Get alert statistics
	getAlertStats() {
		const total = this.alerts.length;
		const active = this.alerts.filter(a => a.isActive && !a.triggered && !this.isAlertExpired(a)).length;
		const triggered = this.alerts.filter(a => a.triggered).length;
		const expired = this.alerts.filter(a => this.isAlertExpired(a)).length;
		const highPriority = this.alerts.filter(a => a.priority === 'high' && a.isActive).length;

		return { total, active, triggered, expired, highPriority };
	}

	// Get alerts by priority
	getAlertsByPriority(priority) {
		return this.alerts.filter(alert => alert.priority === priority);
	}

	// Get alerts by type
	getAlertsByType(alertType) {
		return this.alerts.filter(alert => alert.alertType === alertType);
	}

	// Clear all alerts
	clearAllAlerts() {
		this.alerts = [];
		this.saveAlerts();
	}

	// Clear expired alerts
	clearExpiredAlerts() {
		this.alerts = this.alerts.filter(alert => !this.isAlertExpired(alert));
		this.saveAlerts();
	}

	// Clear triggered alerts
	clearTriggeredAlerts() {
		this.alerts = this.alerts.filter(alert => !alert.triggered);
		this.saveAlerts();
	}

	// Export alerts (for backup)
	exportAlerts() {
		return JSON.stringify(this.alerts, null, 2);
	}

	// Import alerts (for restore)
	importAlerts(alertsJson) {
		try {
			const alerts = JSON.parse(alertsJson);
			if (Array.isArray(alerts)) {
				this.alerts = alerts;
				this.saveAlerts();
				return true;
			}
		} catch (error) {
			console.error('Error importing alerts:', error);
		}
		return false;
	}

	// Validate alert data
	validateAlert(alert) {
		const errors = [];

		if (!alert.symbol || alert.symbol.trim() === '') {
			errors.push('Symbol is required');
		}

		if (!alert.alertType) {
			errors.push('Alert type is required');
		}

		switch (alert.alertType) {
			case 'above':
			case 'below':
				if (!alert.targetPrice || isNaN(alert.targetPrice) || alert.targetPrice <= 0) {
					errors.push('Valid target price is required');
				}
				break;
			case 'percentage':
				if (!alert.percentageChange || isNaN(alert.percentageChange) || alert.percentageChange <= 0) {
					errors.push('Valid percentage change is required');
				}
				break;
			case 'volume':
				if (!alert.volumeThreshold || isNaN(alert.volumeThreshold) || alert.volumeThreshold <= 0) {
					errors.push('Valid volume threshold is required');
				}
				break;
			case 'technical':
				if (!alert.technicalIndicator) {
					errors.push('Technical indicator is required');
				}
				if (!alert.technicalValue || isNaN(alert.technicalValue)) {
					errors.push('Valid technical value is required');
				}
				break;
		}

		return errors;
	}

	// Get alert history
	getAlertHistory(limit = 50) {
		return this.alerts
			.filter(alert => alert.triggered)
			.sort((a, b) => new Date(b.triggeredAt) - new Date(a.triggeredAt))
			.slice(0, limit);
	}

	// Get upcoming alerts (alerts that will expire soon)
	getUpcomingAlerts(hours = 24) {
		const now = new Date();
		const future = new Date(now.getTime() + (hours * 60 * 60 * 1000));
		
		return this.alerts.filter(alert => 
			alert.expiresAt && 
			new Date(alert.expiresAt) <= future &&
			alert.isActive
		);
	}
}

// Create singleton instance
const priceAlertService = new PriceAlertService();

export default priceAlertService; 