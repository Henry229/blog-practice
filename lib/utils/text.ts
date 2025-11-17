// lib/utils/text.ts

/**
 * 텍스트 길이 제한 (말줄임표 추가)
 * @param text - 원본 텍스트
 * @param maxLength - 최대 길이
 * @returns 잘린 텍스트 + "..."
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) {
    return text
  }

  return text.substring(0, maxLength).trim() + "..."
}

/**
 * 고유 ID 생성 (간단한 버전)
 * @returns 고유 ID 문자열
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

/**
 * UUID v4 생성 (더 안전한 버전)
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 문자열을 슬러그로 변환
 * @param text - 원본 텍스트
 * @returns URL-safe 슬러그
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // 특수문자 제거
    .replace(/[\s_-]+/g, "-") // 공백을 하이픈으로
    .replace(/^-+|-+$/g, "") // 앞뒤 하이픈 제거
}

/**
 * 첫 글자 대문자로 변환
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * 단어 개수 세기
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).length
}

/**
 * 읽기 시간 계산 (분)
 * @param text - 텍스트 내용
 * @param wordsPerMinute - 분당 단어 수 (기본 200)
 */
export function calculateReadingTime(
  text: string,
  wordsPerMinute: number = 200
): number {
  const words = countWords(text)
  return Math.ceil(words / wordsPerMinute)
}

/**
 * 이니셜 생성
 * @param name - 사용자 이름 ("John Doe")
 * @returns 이니셜 ("JD")
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) // 최대 2글자
}
