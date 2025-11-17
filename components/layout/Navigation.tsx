"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/AuthProvider"

export function Navigation() {
  const { user } = useAuth()

  return (
    <nav className="flex items-center gap-2">
      {/* New Post 버튼 (로그인 시만 표시) */}
      {user && (
        <Link href="/blog/new">
          <Button>New Post</Button>
        </Link>
      )}

      {/* Login 버튼 (비로그인 시만 표시) */}
      {!user && (
        <Link href="/auth/login">
          <Button variant="ghost">Login</Button>
        </Link>
      )}
    </nav>
  )
}
