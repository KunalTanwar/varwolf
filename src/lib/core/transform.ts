import { MOST_COMMON_PSEUDO_CLASSES_SET, type MostCommonPseudoClass } from "../constants"
import { devWarn, toKebabCase } from "../utils"

export interface TransformResult {
    CSSVars: Record<string, string>
    regularStyles: React.CSSProperties
    pseudoClasses: Record<string, Record<string, string>>
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

export function transformStyles(styles: Record<string, any>, context: TransformContext = {}): TransformResult {
    const CSSVars: Record<string, string> = {}
    const regularStyles: Record<string, any> = {}
    const pseudoClasses: Record<string, Record<string, string>> = {}

    const stateVarsMap = context.stateVarsMap || new Map<string, Record<string, string>>()
    const parentPseudoClasses = context.parentPseudoClasses || []

    if (!context.stateVarsMap) {
        stateVarsMap.set("base", {})
    }

    for (const [key, value] of Object.entries(styles)) {
        if (key.startsWith("__")) {
            const cleanKey = key.slice(2)
            const kebabKey = toKebabCase(cleanKey)
            const varName = "--" + kebabKey

            if (typeof value === "string" || typeof value === "number") {
                CSSVars[varName] = String(value)

                if (!context.parentVars) {
                    stateVarsMap.get("base")![varName] = String(value)
                }
            }
        } else if (key.startsWith("_")) {
            const pseudoClass = toKebabCase(key.slice(1)) as MostCommonPseudoClass

            if (!MOST_COMMON_PSEUDO_CLASSES_SET.has(pseudoClass)) {
                devWarn(
                    `Unsupported pseudo-class: "${pseudoClass}" (from key: "${key}")`,
                    `\nVarwolf supports the 16 most common Pseudo-classes: \n[\n\t${Array.from(
                        MOST_COMMON_PSEUDO_CLASSES_SET
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

    return { CSSVars, regularStyles, pseudoClasses }
}
