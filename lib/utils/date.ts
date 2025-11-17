// lib/utils/date.ts

/**
 * ISO 날짜를 포맷팅
 * @param dateString - ISO 8601 날짜 문자열
 * @returns "Jan 15, 2024" 형식
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * 상대적 시간 표시 ("2 hours ago")
 * @param dateString - ISO 8601 날짜 문자열
 * @returns "just now", "5 minutes ago", "2 days ago" 등
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  // Just now (< 1분)
  if (diffInSeconds < 60) {
    return "just now"
  }

  // Minutes ago (< 1시간)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
  }

  // Hours ago (< 1일)
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
  }

  // Days ago (< 1주)
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
  }

  // Weeks ago (< 1달)
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`
  }

  // 그 이상은 날짜 표시
  return formatDate(dateString)
}

/**
 * 한국어 날짜 포맷 (선택사항)
 * @param dateString - ISO 8601 날짜 문자열
 * @returns "2024년 1월 15일" 형식
 */
export function formatDateKo(dateString: string): string {
  const date = new Date(dateString)

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * 현재 시간 ISO 문자열 생성
 */
export function getCurrentISOString(): string {
  return new Date().toISOString()
}
