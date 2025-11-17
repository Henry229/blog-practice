"use client"

import { Logo } from "@/components/layout/Logo"
import { SearchBar } from "@/components/layout/SearchBar"
import { Navigation } from "@/components/layout/Navigation"
import { UserMenu } from "@/components/layout/UserMenu"
import { useAuth } from "@/components/providers/AuthProvider"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm" role="banner">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Logo />

        {/* SearchBar */}
        <div className="hidden md:block flex-1">
          <SearchBar />
        </div>

        {/* Navigation & UserMenu */}
        <div className="flex items-center gap-4">
          <Navigation />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  )
}
