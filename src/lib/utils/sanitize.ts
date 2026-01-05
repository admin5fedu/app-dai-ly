/**
 * Input sanitization utilities for XSS protection
 */

/**
 * Escapes HTML special characters to prevent XSS attacks
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Sanitizes user input by escaping HTML and trimming whitespace
 */
export function sanitizeInput(input: string): string {
  return escapeHtml(input.trim())
}

/**
 * Validates and sanitizes email input
 */
export function sanitizeEmail(email: string): string {
  return escapeHtml(email.trim().toLowerCase())
}

/**
 * Validates and sanitizes username (alphanumeric and underscore only)
 */
export function sanitizeUsername(username: string): string {
  return escapeHtml(username.trim().replace(/[^a-zA-Z0-9_]/g, ''))
}

/**
 * Removes all HTML tags from input
 */
export function stripHtml(html: string): string {
  const tmp = document.createElement('DIV')
  tmp.textContent = html
  return tmp.innerHTML
}

