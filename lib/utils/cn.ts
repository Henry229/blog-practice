// lib/utils/cn.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind CSS 클래스 병합 유틸리티
 * shadcn/ui에서 사용하는 표준 함수
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
