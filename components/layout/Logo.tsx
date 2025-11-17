import Link from "next/link"
import { FileText } from "lucide-react"

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-blue-600 hover:opacity-80 transition-opacity"
      aria-label="SimpleBlog 홈으로 이동"
    >
      <FileText className="w-6 h-6" />
      <span className="text-lg font-bold">SimpleBlog</span>
    </Link>
  )
}
