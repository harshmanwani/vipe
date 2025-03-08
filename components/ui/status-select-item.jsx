import * as React from "react"
import { cn } from "@/lib/utils"
import { SelectItem } from "@/components/ui/select"

const statusColors = {
  Available: "text-green-500",
  Pending: "text-blue-500",
  Completed: "text-purple-500",
  Sold: "text-red-500",
  default: "text-gray-500"
}

function StatusSelectItem({
  className,
  status,
  ...props
}) {
  return (
    <SelectItem 
      className={cn("flex items-center", className)} 
      {...props}
    >
      <span className={cn("mr-2 h-2 w-2 rounded-full", {
        "bg-green-500": status === "Available",
        "bg-blue-500": status === "Pending",
        "bg-purple-500": status === "Completed",
        "bg-red-500": status === "Sold",
        "bg-gray-500": !status || !statusColors[status]
      })}></span>
      {props.children || status}
    </SelectItem>
  )
}

export { StatusSelectItem } 