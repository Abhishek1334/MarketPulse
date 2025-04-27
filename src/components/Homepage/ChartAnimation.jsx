import React from "react";
import { cn } from "@/lib/utils";

const ChartAnimation = ({ className }) => {
	return (
		<div
			className={cn(
				"w-full h-80 rounded-lg overflow-hidden shadow-lg",
				className
			)}
		>
			<svg viewBox="0 0 400 200" className="w-full h-full bg-white">
				{/* Background grid */}
				<g className="text-gray-200">
					{[0, 1, 2, 3, 4].map((i) => (
						<line
							key={`h-${i}`}
							x1="0"
							y1={40 * i}
							x2="400"
							y2={40 * i}
							stroke="currentColor"
							strokeWidth="1"
						/>
					))}
					{[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
						<line
							key={`v-${i}`}
							x1={50 * i}
							y1="0"
							x2={50 * i}
							y2="200"
							stroke="currentColor"
							strokeWidth="1"
						/>
					))}
				</g>

				{/* Chart Line */}
				<path
					d="M0,150 C50,130 100,170 150,100 S250,40 300,60 L400,30"
					fill="none"
					stroke="#4299e1"
					strokeWidth="3"
				/>

				{/* Area under chart */}
				<path
					d="M0,150 C50,130 100,170 150,100 S250,40 300,60 L400,30 L400,200 L0,200 Z"
					fill="#ebf8ff"
					opacity="0.5"
				/>

				{/* Highlight points */}
				<circle cx="150" cy="100" r="5" fill="#3182ce" />
				<circle cx="300" cy="60" r="5" fill="#3182ce" />
			</svg>
		</div>
	);
};

export default ChartAnimation;
