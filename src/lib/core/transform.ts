/**
 * @fileoverview Style transformation engine for converting Varwolf styles to CSS
 * @module varwolf/core/transform
 **/
import { MOST_COMMON_PSEUDO_CLASSES_SET, type MostCommonPseudoClass } from "../constants"
import { devWarn, toKebabCase } from "../utils"

/**
 * Result of style transformation containing separated CSS variables, regular styles, and pseudo-classes.
 *
 * @property CSSVars - CSS custom properties with -- prefix (e.g., { '--bg': 'red' })
 * @property regularStyles - Standard CSS properties (e.g., { padding: '10px' })
 * @property pseudoClasses - Pseudo-class styles organized by selector (e.g., { 'hover': { '--bg': 'blue' } })
 **/
export interface TransformResult {
    CSSVars: Record<string, string>
    regularStyles: React.CSSProperties
    pseudoClasses: Record<string, Record<string, string>>
}

/**
 * Context passed through recursive style transformation calls.
 *
 * Maintains state during nested pseudo-class processing to handle:
 * - Variable inheritance from parent scopes
 * - State-based variable resolution
 * - Compound pseudo-class selectors (e.g., :hover:focus)
 *
 * @property parentVars - CSS variables from parent scope (for nested pseudo-classes)
 * @property stateVarsMap - Map of pseudo-class states to their CSS variables
 * @property parentPseudoClasses - Chain of parent pseudo-classes for compound selectors
 *
 * @internal
 **/
interface TransformContext {
    parentVars?: Record<string, string>
    stateVarsMap?: Map<string, Record<string, string>>
    parentPseudoClasses?: string[]
}

/**
 * Extracts the "from" parameter value from a variable function.
 *
 * Parses function source code to find the `from` parameter value, which
 * indicates which pseudo-class state a variable should reference.
 *
 * @param fn - The function to parse
 * @returns The from parameter value, or undefined if not found
 *
 * @example
 * ```
 * const fn = (currentValue, from = 'hover') => currentValue
 * extractFromParam(fn) // Returns: 'hover'
 * ```
 *
 * @internal
 **/
function extractFromParam(fn: Function): string | undefined {
    const fnString = fn.toString()
    const match = fnString.match(/from\s*=\s*["']([^"']+)["']/)
    return match ? match[1] : undefined
}

/**
 * Transforms Varwolf style objects into CSS-ready format.
 *
 * Core transformation engine that processes Varwolf's custom style syntax:
 * - `__variable` → CSS custom properties (--variable)
 * - `_pseudoClass` → Pseudo-class selectors (:pseudo-class)
 * - Regular properties → Standard CSS properties
 * - Function values → Computed values with state references
 *
 * Features:
 * - Recursive processing for nested pseudo-classes
 * - Variable inheritance across pseudo-class boundaries
 * - Function-based variable resolution with state references
 * - Compound pseudo-class support (:hover:focus)
 * - Development warnings for invalid pseudo-classes
 *
 * @param styles - The Varwolf style object to transform
 * @param context - Transformation context for recursive calls (internal use)
 * @returns Transformed styles separated by type
 *
 * @example
 * ```
 * const result = transformStyles({
 *   __bg: 'red',
 *   padding: '10px',
 *   _hover: {
 *     __bg: 'blue'
 *   }
 * })
 *
 * // result = {
 * //   CSSVars: { '--bg': 'red' },
 * //   regularStyles: { padding: '10px' },
 * //   pseudoClasses: { 'hover': { '--bg': 'blue' } }
 * // }
 * ```
 *
 * @example
 * ```
 * // Function-based variables
 * transformStyles({
 *   __opacity: 1,
 *   _hover: {
 *     __opacity: (current) => Number(current) * 0.8
 *   }
 * })
 * ```
 **/
export function transformStyles(styles: Record<string, any>, context: TransformContext = {}): TransformResult {
    const CSSVars: Record<string, string> = {}
    const regularStyles: Record<string, any> = {}
    const pseudoClasses: Record<string, Record<string, string>> = {}

    // Initialize state tracking for variable resolution
    const stateVarsMap = context.stateVarsMap || new Map<string, Record<string, string>>()
    const parentPseudoClasses = context.parentPseudoClasses || []

    // Initialize base state for top-level calls
    if (!context.stateVarsMap) {
        stateVarsMap.set("base", {})
    }

    // First pass: Process static values and nested pseudo-classes
    for (const [key, value] of Object.entries(styles)) {
        if (key.startsWith("__")) {
            // CSS variable: __bgColor → --bg-color
            const cleanKey = key.slice(2)
            const kebabKey = toKebabCase(cleanKey)
            const varName = "--" + kebabKey

            if (typeof value === "string" || typeof value === "number") {
                CSSVars[varName] = String(value)

                // Track base state variables for function resolution
                if (!context.parentVars) {
                    stateVarsMap.get("base")![varName] = String(value)
                }
            }
        } else if (key.startsWith("_")) {
            // Pseudo-class: _hover → :hover
            const pseudoClass = toKebabCase(key.slice(1)) as MostCommonPseudoClass

            // Validate pseudo-class in development
            if (!MOST_COMMON_PSEUDO_CLASSES_SET.has(pseudoClass)) {
                devWarn(
                    `Unsupported pseudo-class: "${pseudoClass}" (from key: "${key}")`,
                    `\nVarwolf supports the 16 most common Pseudo-classes: \n[\n\t${Array.from(
                        MOST_COMMON_PSEUDO_CLASSES_SET
                    ).join(",\n\t")}\n]`
                )
            }

            // Build compound selector for nested pseudo-classes (e.g., hover:focus)
            const compoundSelector = [...parentPseudoClasses, pseudoClass].join(":")

            // Recursively process nested pseudo-class styles
            const nestedResult = transformStyles(value, {
                parentVars: CSSVars,
                stateVarsMap,
                parentPseudoClasses: [...parentPseudoClasses, pseudoClass],
            })

            // Merge CSS variables and regular styles for this pseudo-class
            const mergedStyles: Record<string, string> = {
                ...nestedResult.CSSVars,
            }

            for (const [cssKey, cssValue] of Object.entries(nestedResult.regularStyles)) {
                const kebabKey = toKebabCase(cssKey)
                mergedStyles[kebabKey] = String(cssValue)
            }

            // Store pseudo-class variables for function resolution
            stateVarsMap.set(compoundSelector, nestedResult.CSSVars)
            pseudoClasses[compoundSelector] = mergedStyles

            // Include nested pseudo-classes (for :hover:focus scenarios)
            Object.assign(pseudoClasses, nestedResult.pseudoClasses)
        } else {
            regularStyles[key] = value
        }
    }

    // Second pass: Process function-based variables (dependent on first pass)
    for (const [key, value] of Object.entries(styles)) {
        if (key.startsWith("__") && typeof value === "function") {
            const cleanKey = key.slice(2)
            const kebabKey = toKebabCase(cleanKey)
            const varName = "--" + kebabKey

            try {
                // Extract state reference from function parameter
                const fromState = extractFromParam(value)

                let currentValue: string | number = ""

                if (fromState) {
                    // Resolve variable from specified state
                    const targetStateVars = stateVarsMap.get(fromState)

                    if (!targetStateVars) {
                        devWarn(
                            `State "${fromState}" does not exist but is referenced by "${varName}".`,
                            `\nAvailable states: ${Array.from(stateVarsMap.keys()).join(", ")}.`,
                            `\nMake sure to define _${fromState} before referencing it.`
                        )
                    }

                    currentValue = targetStateVars?.[varName] ?? ""

                    if (targetStateVars && !targetStateVars[varName]) {
                        devWarn(
                            `Variable "${varName}" does not exist in state "${fromState}".`,
                            `Available variables in "${fromState}": ${
                                Object.keys(targetStateVars).join(", ") || "none"
                            }`,
                            `Define ${varName} in _${fromState} or check your from parameter.`
                        )
                    }
                } else {
                    // Resolve from parent scope or current scope
                    currentValue = context.parentVars?.[varName] ?? CSSVars[varName] ?? ""

                    if (!currentValue && !context.parentVars) {
                        devWarn(
                            `Variable "${varName}" is used in a function but has no base value.`,
                            `Either define it in the base state or ensure it exists in external CSS.`
                        )
                    }
                }

                // Compute the final value
                const computedValue = value(currentValue, fromState)
                CSSVars[varName] = String(computedValue)

                // Update base state with computed value
                if (!context.parentVars) {
                    stateVarsMap.get("base")![varName] = String(computedValue)
                }
            } catch (error) {
                console.warn(`[Varwolf] Error resolving variable ${varName}:`, error)
                CSSVars[varName] = ""
            }
        }
    }

    return { CSSVars, regularStyles, pseudoClasses }
}
