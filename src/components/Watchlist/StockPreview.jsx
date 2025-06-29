import React from "react";
import moment from "moment";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Target, FileText } from "lucide-react";

const StockPreview = ({ previewStock }) => {
	return (
		<div className="space-y-4">
			{/* Stock Header */}
			<Card className="bg-gradient-to-r from-[var(--primary-50)] to-[var(--accent-50)] dark:from-[var(--primary-900)] dark:to-[var(--accent-900)] border-[var(--primary-200)] dark:border-[var(--primary-700)]">
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-2xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
								{previewStock.symbol}
							</h3>
							<div className="flex items-center gap-1 mt-1">
								<Calendar className="w-4 h-4 text-[var(--text-600)] dark:text-[var(--text-400)]" />
								<p className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)]">
									Added {moment(previewStock.addedAt).format("MMM D, YYYY")}
								</p>
							</div>
						</div>
						{previewStock.targetPrice && (
							<div className="bg-white/80 dark:bg-[var(--background-800)]/80 px-4 py-3 rounded-lg border border-[var(--primary-200)] dark:border-[var(--primary-600)]">
								<div className="flex items-center gap-1 mb-1">
									<Target className="w-4 h-4 text-[var(--primary-600)] dark:text-[var(--primary-400)]" />
									<p className="text-xs text-[var(--primary-600)] dark:text-[var(--primary-400)] font-medium">
										Target Price
									</p>
								</div>
								<p className="text-lg font-bold text-[var(--primary-800)] dark:text-[var(--primary-200)]">
									${previewStock.targetPrice}
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Note Section */}
			{previewStock.note && (
				<Card className="bg-[var(--background-50)] dark:bg-[var(--background-100)] border-[var(--background-200)] dark:border-[var(--background-300)]">
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-2">
							<FileText className="w-4 h-4 text-[var(--text-600)] dark:text-[var(--text-400)]" />
							<p className="text-sm font-medium text-[var(--text-700)] dark:text-[var(--text-300)]">
								Note
							</p>
						</div>
						<p className="text-[var(--text-900)] dark:text-[var(--text-50)] leading-relaxed">
							{previewStock.note}
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default StockPreview;
