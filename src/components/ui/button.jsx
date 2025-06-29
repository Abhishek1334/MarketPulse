import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "bg-[var(--primary-600)] text-[var(--text-50)] hover:bg-[var(--primary-700)] dark:bg-[var(--primary-500)] dark:text-[var(--text-50)] dark:hover:bg-[var(--primary-600)]",
				destructive: "bg-red-500 text-white hover:bg-red-600 dark:bg-[var(--danger-500)] dark:text-[var(--text-50)] dark:hover:bg-red-600",
				outline:
					"border border-[var(--border)] bg-[var(--background-50)] hover:bg-[var(--background-100)] hover:text-[var(--text-950)] dark:bg-[var(--background-200)] dark:text-[var(--text-50)] dark:border-[var(--border-color)] dark:hover:bg-[var(--background-300)]",
				secondary: "bg-[var(--secondary-200)] text-[var(--text-950)] hover:bg-[var(--secondary-300)] dark:bg-[var(--background-300)] dark:text-[var(--text-50)] dark:hover:bg-[var(--background-400)]",
				ghost: "hover:bg-[var(--background-100)] hover:text-[var(--text-950)] dark:text-[var(--text-50)] dark:hover:bg-[var(--background-300)]",
				link: "text-blue-600 underline-offset-4 hover:underline dark:text-[var(--primary-400)]",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

const Button = React.forwardRef(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);

Button.displayName = "Button";

export { Button, buttonVariants };
