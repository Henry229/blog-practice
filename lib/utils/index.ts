// lib/utils/index.ts

// Re-export all utilities
export {
  formatDate,
  formatRelativeTime,
  formatDateKo,
  getCurrentISOString,
} from "./date"

export {
  truncateText,
  generateId,
  generateUUID,
  slugify,
  capitalize,
  countWords,
  calculateReadingTime,
  getInitials,
} from "./text"

export {
  validateEmail,
  validatePassword,
  checkPasswordStrength,
  validateUsername,
  validateBlogForm,
  validateComment,
  type BlogFormValidation,
} from "./validation"

// Re-export cn utility
export { cn } from "./cn"
