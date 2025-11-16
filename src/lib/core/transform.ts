/**
 * @fileoverview Style transformation engine for converting Varwolf styles to CSS
 * @module varwolf/core/transform
 **/
import {
    STANDARD_PSEUDO_CLASSES_SET,
    PSEUDO_ELEMENTS_SET,
    type StandardPseudoClass,
    type PseudoElement,
} from "../constants"
import { devWarn, toKebabCase } from "../utils"

export interface TransformResult {
    CSSVars: Record<string, string>
    regularStyles: React.CSSProperties
    pseudoClasses: Record<string, Record<string, string>>
    pseudoElements: Record<string, Record<string, string>>
}

interface TransformContext {
    parentVars?: Record<string, string>
    stateVarsMap?: Map<string, Record<string, string>>
    parentPseudoClasses?: string[]
}

function extractFromParam(fn: Function): string | undefined {
    const fnString = fn.toString()
    const match = fnString.match(/from\s*=\s*["']([^"']+)["']/)

    return match ? match[1] : undefined
}

/**
 * Checks if a value is a plain object (for variable groups)
 * @internal
 **/
function isPlainObject(value: any): boolean {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.getPrototypeOf(value) === Object.prototype
    )
}

/**
 * Extracts CSS variable names from a string value
 * @internal
 **/
function extractUsedVariables(value: string): string[] {
    const varRegex = /var\((--[\w-]+)\)/g
    const matches: string[] = []

    let match

    while ((match = varRegex.exec(value)) !== null) {
        matches.push(match[1])
    }

    return matches
}

/**
 * Scans styles to find which CSS variables are actually used
 * @internal
 **/
function findUsedVariables(styles: Record<string, any>): Set<string> {
    const usedVars = new Set<string>()

    function scan(obj: any, parentKey = "") {
        if (!obj || typeof obj !== "object") return

        for (const [key, value] of Object.entries(obj)) {
            // Skip variable definitions at root level
            if (parentKey === "" && key.startsWith("__")) {
                continue
            }

            // Scan pseudo-classes and pseudo-elements
            if (key.startsWith("_") || key.startsWith("$")) {
                scan(value, key)

                continue
            }

            // Extract variables from string values
            if (typeof value === "string") {
                const vars = extractUsedVariables(value)

                vars.forEach((v) => usedVars.add(v))
            } else if (typeof value === "object") {
                scan(value, key)
            }
        }
    }

    scan(styles)

    return usedVars
}

/**
 * Transforms Varwolf style objects into CSS-ready format.
 *
 * Supports:
 * - CSS variables: __bg, __spacing: { sm, md, lg }
 * - Pseudo-classes: _hover, _focus
 * - Pseudo-elements: $before, $after
 * - Function-based variables
 *
 * Variable groups are lazily generated - only used variables are injected.
 **/
export function transformStyles(styles: Record<string, any>, context: TransformContext = {}): TransformResult {
    const CSSVars: Record<string, string> = {}
    const regularStyles: Record<string, any> = {}
    const pseudoClasses: Record<string, Record<string, string>> = {}
    const pseudoElements: Record<string, Record<string, string>> = {}

    const stateVarsMap = context.stateVarsMap || new Map<string, Record<string, string>>()
    const parentPseudoClasses = context.parentPseudoClasses || []

    if (!context.stateVarsMap) {
        stateVarsMap.set("base", {})
    }

    // Find used variables (only at top level for optimization)
    const usedVariables = !context.parentVars ? findUsedVariables(styles) : null

    // First pass: Process static values and nested pseudo-classes
    for (const [key, value] of Object.entries(styles)) {
        if (key.startsWith("__")) {
            const cleanKey = key.slice(2)
            const kebabKey = toKebabCase(cleanKey)

            // Check if it's a variable group (plain object)
            if (isPlainObject(value)) {
                // Variable group: __spacing: { sm: '8px', md: '16px' }
                for (const [subKey, subValue] of Object.entries(value)) {
                    const subKebabKey = toKebabCase(subKey)
                    const fullVarName = `--${kebabKey}-${subKebabKey}`

                    // Skip if not used (optimization - only at top level)
                    if (usedVariables && !usedVariables.has(fullVarName)) {
                        continue
                    }

                    if (typeof subValue === "string" || typeof subValue === "number") {
                        CSSVars[fullVarName] = String(subValue)

                        if (!context.parentVars) {
                            stateVarsMap.get("base")![fullVarName] = String(subValue)
                        }
                    } else {
                        devWarn(
                            `Invalid value in variable group "${cleanKey}.${subKey}".`,
                            `Variable groups can only contain strings or numbers.`,
                            `Received: ${typeof subValue}`
                        )
                    }
                }
            } else if (typeof value === "string" || typeof value === "number") {
                // Regular variable
                const varName = "--" + kebabKey
                CSSVars[varName] = String(value)

                if (!context.parentVars) {
                    stateVarsMap.get("base")![varName] = String(value)
                }
            }
            // Functions handled in second pass
        } else if (key.startsWith("$")) {
            const elementName = key.slice(1) as PseudoElement

            if (!PSEUDO_ELEMENTS_SET.has(elementName)) {
                devWarn(
                    `Unsupported pseudo-element: "${elementName}" (from key: "${key}")`,
                    `\nVarwolf supports these pseudo-elements: \n[\n\t${Array.from(PSEUDO_ELEMENTS_SET).join(
                        ",\n\t"
                    )}\n]`
                )
                continue
            }

            const nestedResult = transformStyles(value, {
                parentVars: CSSVars,
                stateVarsMap,
                parentPseudoClasses: [],
            })

            const mergedStyles: Record<string, string> = {
                ...nestedResult.CSSVars,
            }

            for (const [cssKey, cssValue] of Object.entries(nestedResult.regularStyles)) {
                const kebabKey = toKebabCase(cssKey)

                mergedStyles[kebabKey] = String(cssValue)
            }

            pseudoElements[elementName] = mergedStyles
        } else if (key.startsWith("_")) {
            const pseudoClass = toKebabCase(key.slice(1)) as StandardPseudoClass

            if (!STANDARD_PSEUDO_CLASSES_SET.has(pseudoClass)) {
                devWarn(
                    `Unsupported pseudo-class: "${pseudoClass}" (from key: "${key}")`,
                    `\nVarwolf supports the 16 most common Pseudo-classes: \n[\n\t${Array.from(
                        STANDARD_PSEUDO_CLASSES_SET
                    ).join(",\n\t")}\n]`
                )
            }

            const compoundSelector = [...parentPseudoClasses, pseudoClass].join(":")

            const nestedResult = transformStyles(value, {
                parentVars: CSSVars,
                stateVarsMap,
                parentPseudoClasses: [...parentPseudoClasses, pseudoClass],
            })

            const mergedStyles: Record<string, string> = {
                ...nestedResult.CSSVars,
            }

            for (const [cssKey, cssValue] of Object.entries(nestedResult.regularStyles)) {
                const kebabKey = toKebabCase(cssKey)

                mergedStyles[kebabKey] = String(cssValue)
            }

            stateVarsMap.set(compoundSelector, nestedResult.CSSVars)
            pseudoClasses[compoundSelector] = mergedStyles

            Object.assign(pseudoClasses, nestedResult.pseudoClasses)
        } else {
            regularStyles[key] = value
        }
    }

    // Second pass: Process function-based variables
    for (const [key, value] of Object.entries(styles)) {
        if (key.startsWith("__") && typeof value === "function") {
            const cleanKey = key.slice(2)
            const kebabKey = toKebabCase(cleanKey)
            const varName = "--" + kebabKey

            try {
                const fromState = extractFromParam(value)
                let currentValue: string | number = ""

                if (fromState) {
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
                    currentValue = context.parentVars?.[varName] ?? CSSVars[varName] ?? ""

                    if (!currentValue && !context.parentVars) {
                        devWarn(
                            `Variable "${varName}" is used in a function but has no base value.`,
                            `Either define it in the base state or ensure it exists in external CSS.`
                        )
                    }
                }

                const computedValue = value(currentValue, fromState)
                CSSVars[varName] = String(computedValue)

                if (!context.parentVars) {
                    stateVarsMap.get("base")![varName] = String(computedValue)
                }
            } catch (error) {
                console.warn(`[Varwolf] Error resolving variable ${varName}:`, error)
                CSSVars[varName] = ""
            }
        }
    }

    return { CSSVars, regularStyles, pseudoClasses, pseudoElements }
}
