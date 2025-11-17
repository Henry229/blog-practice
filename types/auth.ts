// types/auth.ts
import { AuthUser } from "./user"

/**
 * AuthContext 타입
 * React Context에서 제공하는 인증 상태 및 함수
 */
export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
}

/**
 * 인증 상태
 */
export type AuthState =
  | "unauthenticated" // 로그인하지 않음
  | "authenticated" // 로그인함
  | "loading" // 인증 상태 확인 중
