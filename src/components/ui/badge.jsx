import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--primary-500)] text-[var(--text-50)] hover:bg-[var(--primary-600)] dark:bg-[var(--primary-500)] dark:text-[var(--text-50)] dark:hover:bg-[var(--primary-600)]",
        secondary:
          "border-transparent bg-[var(--secondary-200)] text-[var(--text-950)] hover:bg-[var(--secondary-300)] dark:bg-[var(--background-300)] dark:text-[var(--text-50)] dark:hover:bg-[var(--background-400)]",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-600 dark:bg-[var(--danger-500)] dark:text-[var(--text-50)] dark:hover:bg-red-600",
        outline: "text-[var(--text-950)] dark:text-[var(--text-50)] border-[var(--border-color)]",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-600 dark:bg-[var(--success-500)] dark:text-[var(--text-50)] dark:hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-[var(--warning-500)] dark:text-[var(--text-50)] dark:hover:bg-yellow-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants }; 