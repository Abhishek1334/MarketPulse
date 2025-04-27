import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ActionButton = ({
	children,
	variant = "primary",
	className,
	onClick,
	size,
}) => {
	return (
		<Button
			className={cn(
				variant === "primary"
					? "bg-blue-600 hover:bg-blue-700 text-white"
					: "bg-white border-gray-300 text-gray-700 hover:bg-gray-100",
				className
			)}
			onClick={onClick}
			size={size}
		>
			{children}
		</Button>
	);
};

export default ActionButton;
