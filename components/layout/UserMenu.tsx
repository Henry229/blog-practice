"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/utils/text"
import { useAuth } from "@/components/providers/AuthProvider"
import type { AuthUser } from "@/types"

interface UserMenuProps {
  user: AuthUser | null
}

export function UserMenu({ user }: UserMenuProps) {
  const { logout } = useAuth()

  if (!user) return null

  const handleLogout = () => {
    logout()
  }

  const initials = getInitials(user.username)

  return (
    <div className="flex items-center gap-2">
      {/* Avatar + Username */}
      <div className="flex items-center gap-2">
        <Avatar className="w-8 h-8">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium hidden md:inline">{user.username}</span>
      </div>

      {/* Logout Button */}
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}
