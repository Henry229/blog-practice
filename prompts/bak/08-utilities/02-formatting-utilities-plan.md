# 포맷팅 및 텍스트 처리 유틸리티 구현 계획

## 개요

블로그 애플리케이션에 필요한 유틸리티 함수 구현
- 날짜 포맷팅: formatDate, formatRelativeTime
- 텍스트 처리: truncateText, generateId, slugify
- 재사용 가능한 순수 함수로 구현
- TypeScript 타입 안전성 보장

---

## Task List

### 1. lib/utils/date.ts - 날짜 포맷팅 함수
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `lib/utils/date.ts`

**요구사항:**
- [ ] formatDate(date: string | Date) - 날짜를 "Oct 26, 2023" 형식으로 변환
- [ ] formatRelativeTime(date: string | Date) - 상대 시간 표시 ("2 hours ago", "3 days ago")
- [ ] 다국어 지원 (기본: 영어, 옵션: 한국어)
- [ ] 타임존 처리
- [ ] 유효하지 않은 날짜 처리

**의존성:**
- 없음 (브라우저 내장 Intl API 사용)

**기본 구조:**
```typescript
/**
 * 날짜를 "Oct 26, 2023" 형식으로 포맷
 * @param date - ISO 문자열 또는 Date 객체
 * @param locale - 로케일 (기본: "en-US")
 * @returns 포맷된 날짜 문자열
 */
export function formatDate(
  date: string | Date,
  locale: string = "en-US"
): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date")
    }

    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(dateObj)
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid date"
  }
}

/**
 * 상대 시간을 계산하여 표시 ("2 hours ago", "3 days ago")
 * @param date - ISO 문자열 또는 Date 객체
 * @returns 상대 시간 문자열
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date")
    }

    const now = new Date()
    const diffInSeconds = Math.floor(
      (now.getTime() - dateObj.getTime()) / 1000
    )

    // 미래 날짜 처리
    if (diffInSeconds < 0) {
      return "just now"
    }

    // 시간 단위별 처리
    const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
      { unit: "year", seconds: 31536000 },
      { unit: "month", seconds: 2592000 },
      { unit: "week", seconds: 604800 },
      { unit: "day", seconds: 86400 },
      { unit: "hour", seconds: 3600 },
      { unit: "minute", seconds: 60 },
      { unit: "second", seconds: 1 },
    ]

    for (const { unit, seconds } of units) {
      const interval = Math.floor(diffInSeconds / seconds)
      if (interval >= 1) {
        const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
        return rtf.format(-interval, unit)
      }
    }

    return "just now"
  } catch (error) {
    console.error("Error formatting relative time:", error)
    return "Invalid date"
  }
}

/**
 * 날짜와 시간을 포맷 ("Oct 26, 2023 at 3:30 PM")
 * @param date - ISO 문자열 또는 Date 객체
 * @param locale - 로케일 (기본: "en-US")
 * @returns 포맷된 날짜와 시간 문자열
 */
export function formatDateTime(
  date: string | Date,
  locale: string = "en-US"
): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date")
    }

    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(dateObj)
  } catch (error) {
    console.error("Error formatting date time:", error)
    return "Invalid date"
  }
}
```

**구현 세부사항:**
- **formatDate**: Intl.DateTimeFormat API 사용하여 로케일별 날짜 포맷
- **formatRelativeTime**: Intl.RelativeTimeFormat API 사용하여 상대 시간 계산
- **에러 처리**: 유효하지 않은 날짜 입력 시 "Invalid date" 반환
- **타임존**: 사용자의 로컬 타임존 자동 사용
- **성능**: 내장 API 사용으로 외부 라이브러리 불필요

**완료 조건:**
- [ ] formatDate() 구현 및 테스트 완료
- [ ] formatRelativeTime() 구현 및 테스트 완료
- [ ] formatDateTime() 헬퍼 함수 구현
- [ ] 에러 처리 검증
- [ ] TypeScript 타입 정의 완료

---

### 2. lib/utils/text.ts - 텍스트 처리 함수
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `lib/utils/text.ts`

**요구사항:**
- [ ] truncateText(text, maxLength, suffix) - 텍스트 자르기 (미리보기용, 기본 100자)
- [ ] generateId() - UUID 생성
- [ ] slugify(text) - URL 슬러그 생성 (선택사항)
- [ ] 특수문자 처리
- [ ] 유니코드 지원 (한글, 이모지 등)

**의존성:**
- uuid 라이브러리 (generateId용)

**기본 구조:**
```typescript
import { v4 as uuidv4 } from "uuid"

/**
 * 텍스트를 지정된 길이로 자르고 접미사 추가
 * @param text - 원본 텍스트
 * @param maxLength - 최대 길이 (기본: 100)
 * @param suffix - 접미사 (기본: "...")
 * @returns 잘린 텍스트
 */
export function truncateText(
  text: string,
  maxLength: number = 100,
  suffix: string = "..."
): string {
  if (!text) return ""
  if (text.length <= maxLength) return text

  // 단어 경계에서 자르기 (공백 기준)
  const truncated = text.slice(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(" ")

  if (lastSpaceIndex > 0) {
    return truncated.slice(0, lastSpaceIndex) + suffix
  }

  return truncated + suffix
}

/**
 * UUID v4 생성
 * @returns UUID 문자열
 */
export function generateId(): string {
  return uuidv4()
}

/**
 * 텍스트를 URL 슬러그로 변환
 * @param text - 원본 텍스트
 * @returns URL 안전한 슬러그
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // 특수문자 제거
    .replace(/[\s_-]+/g, "-") // 공백을 하이픈으로
    .replace(/^-+|-+$/g, "") // 시작/끝 하이픈 제거
}

/**
 * 단어 수 계산
 * @param text - 원본 텍스트
 * @returns 단어 개수
 */
export function countWords(text: string): number {
  if (!text) return 0
  return text.trim().split(/\s+/).length
}

/**
 * 읽기 시간 추정 (분)
 * @param text - 원본 텍스트
 * @param wordsPerMinute - 분당 읽기 단어 수 (기본: 200)
 * @returns 읽기 시간 (분)
 */
export function estimateReadingTime(
  text: string,
  wordsPerMinute: number = 200
): number {
  const words = countWords(text)
  const minutes = Math.ceil(words / wordsPerMinute)
  return Math.max(1, minutes) // 최소 1분
}

/**
 * 텍스트에서 첫 N개 문장 추출
 * @param text - 원본 텍스트
 * @param count - 추출할 문장 개수
 * @returns 추출된 문장들
 */
export function getFirstSentences(text: string, count: number = 2): string {
  if (!text) return ""

  const sentences = text.match(/[^.!?]+[.!?]+/g) || []
  return sentences.slice(0, count).join(" ").trim()
}

/**
 * HTML 태그 제거
 * @param html - HTML 문자열
 * @returns 순수 텍스트
 */
export function stripHtml(html: string): string {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, "")
}
```

**구현 세부사항:**
- **truncateText**: 단어 경계에서 자르기로 단어가 중간에 잘리지 않도록 처리
- **generateId**: uuid 라이브러리의 v4 사용 (랜덤 UUID)
- **slugify**: URL 안전한 문자열로 변환 (소문자, 하이픈, 특수문자 제거)
- **countWords**: 공백 기준으로 단어 개수 계산
- **estimateReadingTime**: 평균 읽기 속도 200 단어/분 기준
- **getFirstSentences**: 블로그 미리보기용 첫 N개 문장 추출
- **stripHtml**: HTML 태그 제거하여 순수 텍스트 추출

**완료 조건:**
- [ ] truncateText() 구현 및 테스트 완료
- [ ] generateId() 구현 및 테스트 완료
- [ ] slugify() 구현 및 테스트 완료
- [ ] 헬퍼 함수들 구현 완료
- [ ] 특수문자 및 유니코드 처리 검증
- [ ] TypeScript 타입 정의 완료

---

## 구현 순서

1. **lib/utils/date.ts 구현**
   - formatDate() 함수 작성
   - formatRelativeTime() 함수 작성
   - formatDateTime() 헬퍼 함수 추가
   - 에러 처리 및 테스트

2. **lib/utils/text.ts 구현**
   - truncateText() 함수 작성
   - generateId() 함수 작성
   - slugify() 함수 작성
   - 헬퍼 함수들 추가 (countWords, estimateReadingTime, getFirstSentences, stripHtml)
   - 테스트

3. **테스트 및 검증**
   - 각 함수 단위 테스트
   - 엣지 케이스 테스트 (빈 문자열, null, undefined)
   - 유니코드 문자 테스트 (한글, 이모지)

---

## 검증 체크리스트

### lib/utils/date.ts
- [ ] formatDate()가 "Oct 26, 2023" 형식으로 반환
- [ ] formatRelativeTime()가 "2 hours ago" 형식으로 반환
- [ ] formatRelativeTime()가 시간 단위 자동 선택 (초, 분, 시간, 일, 주, 월, 년)
- [ ] 유효하지 않은 날짜 입력 시 "Invalid date" 반환
- [ ] 미래 날짜 입력 시 "just now" 반환
- [ ] formatDateTime()가 날짜와 시간 모두 포함
- [ ] TypeScript 타입 안전

### lib/utils/text.ts
- [ ] truncateText()가 지정된 길이로 텍스트 자르기
- [ ] truncateText()가 단어 경계에서 자르기
- [ ] generateId()가 유효한 UUID v4 생성
- [ ] slugify()가 URL 안전한 문자열 반환
- [ ] slugify()가 특수문자 제거
- [ ] countWords()가 정확한 단어 수 계산
- [ ] estimateReadingTime()가 합리적인 읽기 시간 추정
- [ ] getFirstSentences()가 올바른 문장 추출
- [ ] stripHtml()가 모든 HTML 태그 제거
- [ ] 빈 문자열 및 null 입력 처리
- [ ] TypeScript 타입 안전

---

## 참고사항

### 사용 예시

**날짜 포맷팅:**
```typescript
import { formatDate, formatRelativeTime } from "@/lib/utils/date"

const blog = {
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-20T15:30:00Z",
}

console.log(formatDate(blog.createdAt)) // "Jan 15, 2024"
console.log(formatRelativeTime(blog.createdAt)) // "2 weeks ago"
```

**텍스트 처리:**
```typescript
import { truncateText, slugify, estimateReadingTime } from "@/lib/utils/text"

const content = "This is a very long blog post content..."

console.log(truncateText(content, 50)) // "This is a very long blog post content..."
console.log(slugify("Hello World! 123")) // "hello-world-123"
console.log(estimateReadingTime(content)) // 3 (분)
```

### 성능 최적화
- **외부 라이브러리 최소화**: 브라우저 내장 Intl API 사용
- **순수 함수**: 부작용 없이 재사용 가능
- **메모이제이션**: 필요 시 React.useMemo로 감싸서 사용

### Intl API 브라우저 지원
- **Intl.DateTimeFormat**: 모든 모던 브라우저 지원
- **Intl.RelativeTimeFormat**: Chrome 71+, Firefox 65+, Safari 14+
- **폴백 전략**: 구형 브라우저는 기본 날짜 문자열 반환

### 추가 기능 (선택사항)
- **다국어 지원**: locale 파라미터 활용
- **커스텀 포맷**: 날짜 포맷 템플릿 추가
- **캐싱**: 자주 사용되는 포맷 결과 캐싱
