import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-[var(--background-300)] dark:border-[var(--background-400)] bg-[var(--background-50)] dark:bg-[var(--background-100)] px-3 py-2 text-sm ring-offset-[var(--background-50)] dark:ring-offset-[var(--background-100)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text-500)] dark:placeholder:text-[var(--text-400)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] dark:focus-visible:ring-[var(--primary-400)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input } 