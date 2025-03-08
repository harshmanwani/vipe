import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      status: {
        Available:
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        Pending:
          "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        Completed:
          "border-transparent bg-purple-500 text-white hover:bg-purple-600",
        Sold:
          "border-transparent bg-red-500 text-white hover:bg-red-600",
        default:
          "border-transparent bg-gray-500 text-white hover:bg-gray-600",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

function StatusBadge({
  className,
  status,
  ...props
}) {
  return (
    <div className={cn(statusBadgeVariants({ status }), className)} {...props} />
  )
}

export { StatusBadge, statusBadgeVariants } 