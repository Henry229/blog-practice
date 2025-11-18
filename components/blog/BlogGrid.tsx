import { ReactNode } from "react"

interface BlogGridProps {
  children: ReactNode
}

export function BlogGrid({ children }: BlogGridProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </section>
  )
}
