/**
 * @fileoverview Stable object serialization for consistent hashing
 * @module varwolf/utils/to-stable-string
 **/

/**
 * WeakMap to track unique IDs for function instances.
 *
 * This ensures that different function references produce different hashes,
 * even if they have identical source code. Uses WeakMap to avoid memory leaks
 * (functions can be garbage collected when no longer referenced).
 *
 * @internal
 **/
const functionIdMap = new WeakMap<Function, number>()

let functionIdCounter = 0

/**
 * Gets or assigns a unique ID for a function reference.
 *
 * This prevents the bug where two different functions with identical source code
 * would produce the same hash, causing style collisions.
 *
 * @param fn - The function to get an ID for
 * @returns A unique numeric ID for this function instance
 *
 * @internal
 **/
function getFunctionId(fn: Function): number {
    if (!functionIdMap.has(fn)) {
        functionIdMap.set(fn, functionIdCounter++)
    }

    return functionIdMap.get(fn)!
}

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
 * - Assigns unique IDs to function instances to prevent hash collisions
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
 * // Different function references produce different output
 * const fn1 = (x) => x * 2
 * const fn2 = (x) => x * 2
 * toStableString({ fn: fn1 })  // '{"fn":"[Function#0:(x) => x * 2]"}'
 * toStableString({ fn: fn2 })  // '{"fn":"[Function#1:(x) => x * 2]"}'
 * ```
 *
 * @example
 * ```
 * // Handles special types
 * toStableString({ date: new Date('2024-01-01'), fn: () => {} })
 * // Returns: '{"date":"Mon Jan 01 2024...","fn":"[Function#2:() => {}]"}'
 * ```
 **/
export const toStableString = (value: any): string => {
    return JSON.stringify(value, (_key, val) => {
        if (val === null) return val

        if (typeof val === "bigint") {
            return val.toString()
        }

        if (typeof val === "function") {
            // Include unique function ID to distinguish identical source code
            const fnId = getFunctionId(val)
            const fnSource = val.toString().replace(/\s+/g, " ").trim()

            return `[Function#${fnId}:${fnSource}]`
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
