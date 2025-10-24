/**
 * @fileoverview Stable object serialization for consistent hashing
 * @module varwolf/utils/to-stable-string
 **/

/**
 * Produces a stable, deterministic string representation of any value.
 *
 * Ensures that deeply equal objects always serialize to identical strings,
 * regardless of property order. This is critical for generating stable
 * hash-based CSS class names.
 *
 * Features:
 * - Alphabetically sorts object keys for consistency
 * - Handles edge cases: bigint, Date, RegExp, functions, null
 * - Uses JSON.stringify with a custom replacer for reliability
 *
 * @param value - Any JavaScript value to stringify
 * @returns A stable string representation suitable for hashing
 *
 * @example
 * ```
 * // These produce identical output (key order doesn't matter)
 * toStableString({ b: 2, a: 1 })
 * toStableString({ a: 1, b: 2 })
 * // Both return: '{"a":1,"b":2}'
 * ```
 *
 * @example
 * ```
 * // Handles special types
 * toStableString({ date: new Date('2024-01-01'), fn: () => {} })
 * // Returns: '{"date":"Mon Jan 01 2024...","fn":"() => {}"}'
 * ```
 **/

export const toStableString = (value: any): string => {
    return JSON.stringify(value, (_key, val) => {
        if (val === null) return val

        if (typeof val === "bigint") {
            return val.toString()
        }

        if (typeof val === "function") {
            return val.toString().replace(/\s+/g, " ").trim()
        }

        if (val && typeof val === "object" && !Array.isArray(val)) {
            if (val instanceof Date || val instanceof RegExp) {
                return val.toString()
            }

            return Object.keys(val)
                .sort()
                .reduce((acc, k) => {
                    acc[k] = val[k]
                    return acc
                }, {} as Record<string, any>)
        }

        return val
    })
}
