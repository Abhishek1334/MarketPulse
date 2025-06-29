import React, { useState, useEffect } from "react";
import { X, TrendingUp, TrendingDown, Percent, BarChart3, Volume2, Zap, Calendar, Clock, AlertTriangle, Bell, Settings, Repeat, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess, showError, showInfo } from "@/utils/toast";
import priceAlertService from "@/service/PriceAlertService";
import { cn } from "@/lib/utils";

const PriceAlertModal = ({ isOpen, onClose, symbol, currentPrice }) => {
	const [alertType, setAlertType] = useState("above");
	const [price, setPrice] = useState("");
	const [percentageChange, setPercentageChange] = useState("");
	const [volumeThreshold, setVolumeThreshold] = useState("");
	const [technicalIndicator, setTechnicalIndicator] = useState("rsi");
	const [technicalValue, setTechnicalValue] = useState("");
	const [note, setNote] = useState("");
	const [priority, setPriority] = useState("medium");
	const [repeat, setRepeat] = useState(false);
	const [repeatInterval, setRepeatInterval] = useState("once");
	const [expiresAt, setExpiresAt] = useState("");
	const [sound, setSound] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [validationErrors, setValidationErrors] = useState({});

	// Reset form when modal opens
	useEffect(() => {
		if (isOpen) {
			setPrice("");
			setPercentageChange("");
			setVolumeThreshold("");
			setTechnicalValue("");
			setNote("");
			setPriority("medium");
			setRepeat(false);
			setRepeatInterval("once");
			setExpiresAt("");
			setSound(true);
			setValidationErrors({});
		}
	}, [isOpen]);

	// Set default price when current price changes
	useEffect(() => {
		if (currentPrice && alertType === "above") {
			setPrice((parseFloat(currentPrice) * 1.05).toFixed(2)); // 5% above current
		} else if (currentPrice && alertType === "below") {
			setPrice((parseFloat(currentPrice) * 0.95).toFixed(2)); // 5% below current
		}
	}, [currentPrice, alertType]);

	const alertTypes = [
		{
			id: "above",
			name: "Price Above",
			icon: TrendingUp,
			description: "Alert when price goes above target",
			color: "text-green-600 dark:text-green-400",
			bgColor: "bg-green-50 dark:bg-green-900/20",
			borderColor: "border-green-200 dark:border-green-800"
		},
		{
			id: "below",
			name: "Price Below",
			icon: TrendingDown,
			description: "Alert when price goes below target",
			color: "text-red-600 dark:text-red-400",
			bgColor: "bg-red-50 dark:bg-red-900/20",
			borderColor: "border-red-200 dark:border-red-800"
		},
		{
			id: "percentage",
			name: "Percentage Change",
			icon: Percent,
			description: "Alert on percentage change from current",
			color: "text-blue-600 dark:text-blue-400",
			bgColor: "bg-blue-50 dark:bg-blue-900/20",
			borderColor: "border-blue-200 dark:border-blue-800"
		},
		{
			id: "volume",
			name: "Volume Spike",
			icon: Volume2,
			description: "Alert when volume exceeds threshold",
			color: "text-purple-600 dark:text-purple-400",
			bgColor: "bg-purple-50 dark:bg-purple-900/20",
			borderColor: "border-purple-200 dark:border-purple-800"
		},
		{
			id: "technical",
			name: "Technical Indicator",
			icon: Zap,
			description: "Alert based on technical indicators",
			color: "text-orange-600 dark:text-orange-400",
			bgColor: "bg-orange-50 dark:bg-orange-900/20",
			borderColor: "border-orange-200 dark:border-orange-800"
		}
	];

	const technicalIndicators = [
		{ id: "rsi", name: "RSI", description: "Relative Strength Index (0-100)" },
		{ id: "macd", name: "MACD", description: "Moving Average Convergence Divergence" },
		{ id: "sma", name: "SMA", description: "Simple Moving Average" }
	];

	const priorities = [
		{ id: "low", name: "Low", icon: Bell, color: "text-gray-600 dark:text-gray-400" },
		{ id: "medium", name: "Medium", icon: AlertTriangle, color: "text-yellow-600 dark:text-yellow-400" },
		{ id: "high", name: "High", icon: Star, color: "text-red-600 dark:text-red-400" }
	];

	const repeatIntervals = [
		{ id: "once", name: "Once", description: "Trigger once only" },
		{ id: "daily", name: "Daily", description: "Repeat every day" },
		{ id: "weekly", name: "Weekly", description: "Repeat every week" }
	];

	const validateForm = () => {
		const errors = {};

		if (!symbol) {
			errors.symbol = "Symbol is required";
		}

		switch (alertType) {
			case "above":
			case "below":
				if (!price || isNaN(price) || parseFloat(price) <= 0) {
					errors.price = "Valid target price is required";
				}
				break;
			case "percentage":
				if (!percentageChange || isNaN(percentageChange) || parseFloat(percentageChange) <= 0) {
					errors.percentageChange = "Valid percentage change is required";
				}
				break;
			case "volume":
				if (!volumeThreshold || isNaN(volumeThreshold) || parseFloat(volumeThreshold) <= 0) {
					errors.volumeThreshold = "Valid volume threshold is required";
				}
				break;
			case "technical":
				if (!technicalValue || isNaN(technicalValue)) {
					errors.technicalValue = "Valid technical value is required";
				}
				break;
		}

		if (expiresAt && new Date(expiresAt) <= new Date()) {
			errors.expiresAt = "Expiration date must be in the future";
		}

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			showError("Please fix the validation errors");
			return;
		}

		setIsLoading(true);

		try {
			const alertData = {
				symbol,
				alertType,
				currentPrice: parseFloat(currentPrice),
				note,
				priority,
				repeat,
				repeatInterval,
				sound,
				expiresAt: expiresAt || null
			};

			// Add type-specific data
			switch (alertType) {
				case "above":
				case "below":
					alertData.targetPrice = parseFloat(price);
					break;
				case "percentage":
					alertData.percentageChange = parseFloat(percentageChange);
					break;
				case "volume":
					alertData.volumeThreshold = parseFloat(volumeThreshold);
					break;
				case "technical":
					alertData.technicalIndicator = technicalIndicator;
					alertData.technicalValue = parseFloat(technicalValue);
					break;
			}

			// Validate with service
			const validationErrors = priceAlertService.validateAlert(alertData);
			if (validationErrors.length > 0) {
				showError(validationErrors.join(", "));
				return;
			}

			const newAlert = priceAlertService.addAlert(alertData);
			
			showSuccess(`Alert created for ${symbol}! You'll be notified when conditions are met.`);
			onClose();
		} catch (error) {
			console.error("Error creating alert:", error);
			showError("Failed to create alert. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const getCurrentValuePreview = () => {
		if (!currentPrice) return null;

		switch (alertType) {
			case "above":
			case "below":
				return price ? `$${price}` : null;
			case "percentage":
				return percentageChange ? `${percentageChange}%` : null;
			case "volume":
				return volumeThreshold ? volumeThreshold.toLocaleString() : null;
			case "technical":
				return technicalValue ? `${technicalIndicators.find(t => t.id === technicalIndicator)?.name}: ${technicalValue}` : null;
			default:
				return null;
		}
	};

	const getAlertDescription = () => {
		const selectedType = alertTypes.find(t => t.id === alertType);
		if (!selectedType) return "";

		const preview = getCurrentValuePreview();
		if (!preview) return selectedType.description;

		return `${selectedType.description} (${preview})`;
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-[var(--background-100)] dark:bg-[var(--background-200)] border-[var(--background-200)] dark:border-[var(--background-300)] shadow-2xl">
				<CardHeader className="border-b border-[var(--background-300)] dark:border-[var(--background-400)]">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-lg flex items-center justify-center">
								<Bell className="w-5 h-5 text-white" />
							</div>
							<div>
								<CardTitle className="text-xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
									Create Price Alert
								</CardTitle>
								<p className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)] mt-1">
									Set up advanced alerts for {symbol}
								</p>
							</div>
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							className="hover:bg-[var(--background-300)] dark:hover:bg-[var(--background-400)]"
						>
							<X className="w-5 h-5" />
						</Button>
					</div>
				</CardHeader>

				<CardContent className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Current Price Display */}
						{currentPrice && (
							<div className="p-4 bg-[var(--background-200)] dark:bg-[var(--background-300)] rounded-lg border border-[var(--background-300)] dark:border-[var(--background-400)]">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium text-[var(--text-700)] dark:text-[var(--text-300)]">
										Current Price:
									</span>
									<span className="text-lg font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
										${parseFloat(currentPrice).toFixed(2)}
									</span>
								</div>
							</div>
						)}

						{/* Alert Type Selection */}
						<div>
							<Label className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)] mb-3 block">
								Alert Type
							</Label>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
								{alertTypes.map((type) => (
									<button
										key={type.id}
										type="button"
										onClick={() => setAlertType(type.id)}
										className={cn(
											"p-4 rounded-lg border-2 transition-all duration-200 text-left",
											alertType === type.id
												? `${type.bgColor} ${type.borderColor} border-2`
												: "bg-[var(--background-200)] dark:bg-[var(--background-300)] border-[var(--background-300)] dark:border-[var(--background-400)] hover:border-[var(--primary-300)] dark:hover:border-[var(--primary-600)]"
										)}
									>
										<div className="flex items-center gap-3">
											<type.icon className={cn("w-5 h-5", type.color)} />
											<div>
												<div className={cn("font-semibold", type.color)}>
													{type.name}
												</div>
												<div className="text-xs text-[var(--text-600)] dark:text-[var(--text-400)] mt-1">
													{type.description}
												</div>
											</div>
										</div>
									</button>
								))}
							</div>
						</div>

						{/* Alert Configuration */}
						<div className="space-y-4">
							{/* Price Input */}
							{(alertType === "above" || alertType === "below") && (
								<div>
									<Label htmlFor="price" className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)]">
										Target Price ($)
									</Label>
									<Input
										id="price"
										type="number"
										step="0.01"
										value={price}
										onChange={(e) => setPrice(e.target.value)}
										placeholder="Enter target price"
										className={cn(
											"mt-1",
											validationErrors.price && "border-red-500 focus:border-red-500"
										)}
									/>
									{validationErrors.price && (
										<p className="text-red-500 text-xs mt-1">{validationErrors.price}</p>
									)}
								</div>
							)}

							{/* Percentage Change Input */}
							{alertType === "percentage" && (
								<div>
									<Label htmlFor="percentageChange" className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)]">
										Percentage Change (%)
									</Label>
									<Input
										id="percentageChange"
										type="number"
										step="0.1"
										value={percentageChange}
										onChange={(e) => setPercentageChange(e.target.value)}
										placeholder="Enter percentage change"
										className={cn(
											"mt-1",
											validationErrors.percentageChange && "border-red-500 focus:border-red-500"
										)}
									/>
									{validationErrors.percentageChange && (
										<p className="text-red-500 text-xs mt-1">{validationErrors.percentageChange}</p>
									)}
								</div>
							)}

							{/* Volume Threshold Input */}
							{alertType === "volume" && (
								<div>
									<Label htmlFor="volumeThreshold" className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)]">
										Volume Threshold
									</Label>
									<Input
										id="volumeThreshold"
										type="number"
										value={volumeThreshold}
										onChange={(e) => setVolumeThreshold(e.target.value)}
										placeholder="Enter volume threshold"
										className={cn(
											"mt-1",
											validationErrors.volumeThreshold && "border-red-500 focus:border-red-500"
										)}
									/>
									{validationErrors.volumeThreshold && (
										<p className="text-red-500 text-xs mt-1">{validationErrors.volumeThreshold}</p>
									)}
								</div>
							)}

							{/* Technical Indicator Input */}
							{alertType === "technical" && (
								<div className="space-y-3">
									<div>
										<Label htmlFor="technicalIndicator" className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)]">
											Technical Indicator
										</Label>
										<select
											id="technicalIndicator"
											value={technicalIndicator}
											onChange={(e) => setTechnicalIndicator(e.target.value)}
											className="w-full mt-1 px-3 py-2 bg-[var(--background-100)] dark:bg-[var(--background-200)] border border-[var(--background-300)] dark:border-[var(--background-400)] rounded-md text-[var(--text-900)] dark:text-[var(--text-50)]"
										>
											{technicalIndicators.map((indicator) => (
												<option key={indicator.id} value={indicator.id}>
													{indicator.name} - {indicator.description}
												</option>
											))}
										</select>
									</div>
									<div>
										<Label htmlFor="technicalValue" className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)]">
											Target Value
										</Label>
										<Input
											id="technicalValue"
											type="number"
											step="0.01"
											value={technicalValue}
											onChange={(e) => setTechnicalValue(e.target.value)}
											placeholder="Enter target value"
											className={cn(
												"mt-1",
												validationErrors.technicalValue && "border-red-500 focus:border-red-500"
											)}
										/>
										{validationErrors.technicalValue && (
											<p className="text-red-500 text-xs mt-1">{validationErrors.technicalValue}</p>
										)}
									</div>
								</div>
							)}
						</div>

						{/* Advanced Options */}
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<Settings className="w-4 h-4 text-[var(--text-600)] dark:text-[var(--text-400)]" />
								<h3 className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)]">
									Advanced Options
								</h3>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{/* Priority Selection */}
								<div>
									<Label className="text-sm font-medium text-[var(--text-600)] dark:text-[var(--text-400)] mb-2 block">
										Priority
									</Label>
									<div className="flex gap-2">
										{priorities.map((p) => (
											<button
												key={p.id}
												type="button"
												onClick={() => setPriority(p.id)}
												className={cn(
													"flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
													priority === p.id
														? "bg-[var(--primary-100)] dark:bg-[var(--primary-800)] text-[var(--primary-700)] dark:text-[var(--primary-300)] border border-[var(--primary-300)] dark:border-[var(--primary-600)]"
														: "bg-[var(--background-200)] dark:bg-[var(--background-300)] text-[var(--text-700)] dark:text-[var(--text-300)] border border-[var(--background-300)] dark:border-[var(--background-400)] hover:border-[var(--primary-300)] dark:hover:border-[var(--primary-600)]"
												)}
											>
												<p.icon className={cn("w-4 h-4", p.color)} />
												{p.name}
											</button>
										))}
									</div>
								</div>

								{/* Repeat Options */}
								<div>
									<Label className="text-sm font-medium text-[var(--text-600)] dark:text-[var(--text-400)] mb-2 block">
										Repeat
									</Label>
									<div className="flex items-center gap-3">
										<label className="flex items-center gap-2">
											<input
												type="checkbox"
												checked={repeat}
												onChange={(e) => setRepeat(e.target.checked)}
												className="rounded border-[var(--background-300)] dark:border-[var(--background-400)]"
											/>
											<span className="text-sm text-[var(--text-700)] dark:text-[var(--text-300)]">
												Repeat Alert
											</span>
										</label>
									</div>
									{repeat && (
										<select
											value={repeatInterval}
											onChange={(e) => setRepeatInterval(e.target.value)}
											className="w-full mt-2 px-3 py-2 bg-[var(--background-100)] dark:bg-[var(--background-200)] border border-[var(--background-300)] dark:border-[var(--background-400)] rounded-md text-[var(--text-900)] dark:text-[var(--text-50)] text-sm"
										>
											{repeatIntervals.map((interval) => (
												<option key={interval.id} value={interval.id}>
													{interval.name} - {interval.description}
												</option>
											))}
										</select>
									)}
								</div>
							</div>

							{/* Expiration Date */}
							<div>
								<Label htmlFor="expiresAt" className="text-sm font-medium text-[var(--text-600)] dark:text-[var(--text-400)]">
									Expiration Date (Optional)
								</Label>
								<Input
									id="expiresAt"
									type="datetime-local"
									value={expiresAt}
									onChange={(e) => setExpiresAt(e.target.value)}
									className={cn(
										"mt-1",
										validationErrors.expiresAt && "border-red-500 focus:border-red-500"
									)}
								/>
								{validationErrors.expiresAt && (
									<p className="text-red-500 text-xs mt-1">{validationErrors.expiresAt}</p>
								)}
							</div>

							{/* Sound Toggle */}
							<div>
								<label className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={sound}
										onChange={(e) => setSound(e.target.checked)}
										className="rounded border-[var(--background-300)] dark:border-[var(--background-400)]"
									/>
									<span className="text-sm text-[var(--text-700)] dark:text-[var(--text-300)]">
										Play sound notification
									</span>
								</label>
							</div>
						</div>

						{/* Note */}
						<div>
							<Label htmlFor="note" className="text-sm font-medium text-[var(--text-600)] dark:text-[var(--text-400)]">
								Note (Optional)
							</Label>
							<Textarea
								id="note"
								value={note}
								onChange={(e) => setNote(e.target.value)}
								placeholder="Add a note to remember why you set this alert..."
								rows={3}
								className="mt-1"
							/>
						</div>

						{/* Alert Preview */}
						{getCurrentValuePreview() && (
							<div className="p-4 bg-[var(--background-200)] dark:bg-[var(--background-300)] rounded-lg border border-[var(--background-300)] dark:border-[var(--background-400)]">
								<div className="flex items-center gap-2 mb-2">
									<Bell className="w-4 h-4 text-[var(--primary-500)]" />
									<span className="text-sm font-semibold text-[var(--text-700)] dark:text-[var(--text-300)]">
										Alert Preview
									</span>
								</div>
								<p className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">
									{getAlertDescription()}
								</p>
							</div>
						)}

						{/* Action Buttons */}
						<div className="flex gap-3 pt-4 border-t border-[var(--background-300)] dark:border-[var(--background-400)]">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="flex-1 hover:bg-[var(--background-200)] dark:hover:bg-[var(--background-300)] text-[var(--text-700)] dark:text-[var(--text-300)] border-[var(--background-300)] dark:border-[var(--background-400)]"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isLoading}
								className="flex-1 bg-gradient-to-r from-[var(--primary-600)] to-[var(--accent-600)] hover:from-[var(--primary-700)] hover:to-[var(--accent-700)] text-white"
							>
								{isLoading ? (
									<>
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
										Creating...
									</>
								) : (
									<>
										<Bell className="w-4 h-4 mr-2" />
										Create Alert
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default PriceAlertModal; 