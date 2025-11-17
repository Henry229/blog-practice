import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CenteredContainerProps {
  children: ReactNode
  className?: string
}

export function CenteredContainer({
  children,
  className,
}: CenteredContainerProps) {
  return (
    <div
      className={cn(
        "max-w-[600px] mx-auto p-8 bg-white rounded-lg shadow-md",
        className
      )}
    >
      {children}
    </div>
  )
}
