import { toKebabCase } from "../utils"
import { isDev } from "../utils/dev-warnings"

const STYLE_TAG_ID = "varwolf-styles"
const STYLE_CACHE = new Set<string>()

function fetchStyleTag(): HTMLStyleElement {
    let styleTag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement

    if (!styleTag) {
        styleTag = document.createElement("style")

        styleTag.id = STYLE_TAG_ID

        document.head.appendChild(styleTag)
    }

    return styleTag
}

export function injectCSS(
    hash: string,
    CSSVars: Record<string, string>,
    regularStyles: Record<string, any>,
    pseudoClasses: Record<string, Record<string, string>> = {}
): void {
    if (STYLE_CACHE.has(hash)) {
        return
    }

    const styleTag = fetchStyleTag()
    const CSSRules: string[] = []

    const baseStyles: Record<string, string> = {
        ...CSSVars,
    }

    for (const [key, value] of Object.entries(regularStyles)) {
        const kebabKey = toKebabCase(key)
        baseStyles[kebabKey] = String(value)
    }

    if (Object.keys(baseStyles).length > 0) {
        const baseVars = Object.entries(baseStyles)
            .map(([key, value]) => `${key}: ${value};`)
            .join(" ")

        CSSRules.push(`.${hash} { ${baseVars} }`)
    }

    for (const [pseudoClass, vars] of Object.entries(pseudoClasses)) {
        const pseudoVars = Object.entries(vars)
            .map(([key, value]) => `${key}: ${value};`)
            .join(" ")

        if (pseudoVars) {
            CSSRules.push(`.${hash}:${pseudoClass} { ${pseudoVars} }`)
        }
    }

    if (CSSRules.length === 0) {
        return
    }

    if (isDev()) {
        const CSSText = CSSRules.join("\n") + "\n"

        styleTag.textContent = (styleTag.textContent || "") + CSSText
    } else {
        const styleSheet = styleTag.sheet as CSSStyleSheet

        if (!styleSheet) {
            console.error("[Varwolf] CSSStyleSheet not available.")
            return
        }

        for (const rule of CSSRules) {
            try {
                styleSheet.insertRule(rule, styleSheet.cssRules.length)
            } catch (error) {
                console.error("[Varwolf] Failed to insert CSS rule :", rule, error)
            }
        }
    }

    STYLE_CACHE.add(hash)
}

export function removeStyles(): void {
    const styleTag = document.getElementById(STYLE_TAG_ID)

    if (styleTag) {
        styleTag.remove()
    }

    STYLE_CACHE.clear()
}

export function getCacheSize(): number {
    return STYLE_CACHE.size
}

export function getInjectedCSS(): string {
    const styleTag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement

    if (!styleTag) {
        return ""
    }

    if (isDev()) {
        return styleTag.textContent || ""
    }

    if (styleTag.sheet) {
        const rules = Array.from(styleTag.sheet.cssRules)
        return rules.map((rule) => rule.cssText).join("\n")
    }

    return ""
}
