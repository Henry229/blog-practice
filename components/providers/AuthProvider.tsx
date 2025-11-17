"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { AuthUser } from "@/types"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  // Mock user - Phase 2에서 실제 Supabase 인증으로 교체 예정
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading] = useState(false)

  const logout = () => {
    // Phase 2에서 실제 Supabase signOut으로 교체 예정
    setUser(null)
    router.push("/")
    router.refresh()
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
