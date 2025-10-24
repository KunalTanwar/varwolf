/**
 * @fileoverview Development utilities for warnings, errors, and environment detection
 * @module varwolf/utils/dev-warnings
 **/

/**
 * Flag indicating whether the application is running in development mode.
 * Determined by checking if NODE_ENV environment variable equals 'development'.
 *
 * @constant
 * @type {boolean}
 **/
const IS_DEV = process.env.NODE_ENV === "development"

/**
 * Global flag controlling whether development warnings are displayed.
 * Can be toggled at runtime using enableWarnings() and disableWarnings().
 *
 * @type {boolean}
 * @default true
 **/
let warningsEnabled = true

/**
 * Disables development warnings globally.
 *
 * Useful for:
 * - Testing scenarios where warnings should be suppressed
 * - Production builds that accidentally run in development mode
 * - Silencing known warnings during specific operations
 *
 * Note: This only affects devWarn() calls. devError() is always shown.
 *
 * @example
 * ```
 * import { disableWarnings } from 'varwolf'
 *
 * disableWarnings()
 * // All subsequent devWarn() calls will be suppressed
 * ```
 **/
export function disableWarnings(): void {
    warningsEnabled = false
}

/**
 * Re-enables development warnings after they were disabled.
 *
 * Warnings are enabled by default, so this is only needed after
 * calling disableWarnings().
 *
 * @example
 * ```
 * import { disableWarnings, enableWarnings } from 'varwolf'
 *
 * disableWarnings()
 * // ... do something without warnings
 * enableWarnings()
 * // Warnings active again
 * ```
 **/
export function enableWarnings(): void {
    warningsEnabled = true
}

/**
 * Displays a styled development warning in the console.
 *
 * Shows warnings only when:
 * - Running in development mode (NODE_ENV === 'development')
 * - Warnings are enabled (via enableWarnings/disableWarnings)
 *
 * Warnings appear with:
 * - Bold "[Varwolf Warning]:" prefix
 * - Main message
 * - Additional detail lines (each on a new line)
 *
 * Used throughout Varwolf to warn developers about:
 * - Invalid pseudo-class names
 * - Missing variable definitions
 * - Incorrect state references
 * - Other development-time issues
 *
 * @param message - The main warning message
 * @param details - Additional context lines (optional, each appears on a new line)
 *
 * @example
 * ```
 * devWarn(
 *   'Unsupported pseudo-class: "invalid-class"',
 *   'Varwolf supports: hover, focus, active',
 *   'Check your style object for typos'
 * )
 * // Console output:
 * // [Varwolf Warning]: Unsupported pseudo-class: "invalid-class"
 * // Varwolf supports: hover, focus, active
 * // Check your style object for typos
 * ```
 **/
export function devWarn(message: string, ...details: string[]): void {
    if (!IS_DEV || !warningsEnabled) return

    console.warn("%c[Varwolf Warning] :", "font-weight: 700", `${message}`, ...details.map((detail) => `\n${detail}`))
}

/**
 * Displays a styled error message in the console.
 *
 * Unlike devWarn(), this function:
 * - Always runs regardless of NODE_ENV
 * - Cannot be disabled (ignores warningsEnabled flag)
 * - Uses console.error instead of console.warn
 *
 * Used for critical issues that must be reported even in production,
 * such as:
 * - Failed CSS injection
 * - Invalid function parameters
 * - Runtime errors that break functionality
 *
 * @param message - The main error message
 * @param details - Additional context lines (optional, each appears on a new line)
 *
 * @example
 * ```
 * devError(
 *   'Failed to inject CSS rule',
 *   'Rule: .vw-12345 { color: red; }',
 *   'Check browser compatibility'
 * )
 * // Console output (always shown):
 * // [Varwolf Error]: Failed to inject CSS rule
 * // Rule: .vw-12345 { color: red; }
 * // Check browser compatibility
 * ```
 **/
export function devError(message: string, ...details: string[]): void {
    console.error("%c[Varwolf Error] :", "font-weight: 700", `${message}`, ...details.map((detail) => `\n${detail}`))
}

/**
 * Returns whether the application is running in development mode.
 *
 * Useful for:
 * - Conditional rendering of debug tools
 * - Feature flags (enable only in dev)
 * - Performance vs debugging tradeoffs
 * - Different CSS injection strategies
 *
 * @returns True if NODE_ENV === 'development', false otherwise
 *
 * @example
 * ```
 * import { isDev } from 'varwolf'
 *
 * if (isDev()) {
 *   console.log('Running in development mode')
 * }
 * ```
 *
 * @example
 * ```
 * // Used internally for CSS injection strategy
 * if (isDev()) {
 *   // Use textContent for easier DevTools inspection
 *   styleTag.textContent += cssText
 * } else {
 *   // Use insertRule for better performance
 *   styleSheet.insertRule(rule)
 * }
 * ```
 **/
export function isDev(): boolean {
    return IS_DEV
}
