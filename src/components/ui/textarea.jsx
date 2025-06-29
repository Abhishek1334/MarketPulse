import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-[var(--background-300)] dark:border-[var(--background-400)] bg-[var(--background-50)] dark:bg-[var(--background-100)] px-3 py-2 text-sm ring-offset-[var(--background-50)] dark:ring-offset-[var(--background-100)] placeholder:text-[var(--text-500)] dark:placeholder:text-[var(--text-400)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] dark:focus-visible:ring-[var(--primary-400)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea } 