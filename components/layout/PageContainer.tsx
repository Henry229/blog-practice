import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main className={cn("max-w-[1200px] mx-auto px-4 md:px-6 pt-16 pb-6", className)}>
      {children}
    </main>
  )
}
