/**
 * @fileoverview Generates stable CSS class names from style objects
 * @module varwolf/core/stable-hash
 **/
import { fnv1a, toStableString } from "../utils"

/**
 * Generates a stable, deterministic CSS class name from a style object.
 *
 * Creates a hash-based class name prefixed with 'vw-' (Varwolf).
 * The same style object will always produce the same class name,
 * regardless of property order or when it's called.
 *
 * Process:
 * 1. Serialize style object to stable string
 * 2. Hash string using FNV-1a algorithm
 * 3. Prefix with 'vw-' for namespacing
 *
 * @param styles - The style object to hash
 * @returns A stable CSS class name (e.g., 'vw-1234567890')
 *
 * @example
 * ```
 * const className = createStableHash({ color: 'red', fontSize: '16px' })
 * // Returns: 'vw-2891336453'
 *
 * // Same object produces same hash
 * const className2 = createStableHash({ fontSize: '16px', color: 'red' })
 * // Returns: 'vw-2891336453' (identical)
 * ```
 *
 * @internal Used internally by useVarwolf hook
 **/
export function createStableHash(value: any) {
    const stableString = toStableString(value)
    const hash = fnv1a(stableString)

    return `vw-${hash}`
}
