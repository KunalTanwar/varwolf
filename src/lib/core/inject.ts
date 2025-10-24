/**
 * @fileoverview CSS injection system for dynamically inserting styles into the document
 * @module varwolf/core/inject
 **/
import { isDev, toKebabCase } from "../utils"

/**
 * ID of the global style tag where all Varwolf styles are injected.
 * All generated CSS rules are inserted into this single <style> element.
 **/
const STYLE_TAG_ID = "varwolf-styles"

/**
 * Cache of injected style hashes to prevent duplicate CSS injection.
 * Tracks which style combinations have already been added to the document.
 *
 * @internal
 **/
const STYLE_CACHE = new Set<string>()

/**
 * Retrieves or creates the global Varwolf style tag in the document head.
 *
 * Ensures a single <style> element exists for all Varwolf-generated CSS.
 * If the style tag doesn't exist, it creates one and appends it to document.head.
 *
 * @returns The Varwolf style tag element
 *
 * @example
 * ```
 * const styleTag = fetchStyleTag()
 * console.log(styleTag.id) // 'varwolf-styles'
 * ```
 *
 * @internal
 **/
function fetchStyleTag(): HTMLStyleElement {
    let styleTag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement

    if (!styleTag) {
        styleTag = document.createElement("style")

        styleTag.id = STYLE_TAG_ID

        document.head.appendChild(styleTag)
    }

    return styleTag
}

/**
 * Injects CSS rules into the document for a given style hash.
 *
 * Core function that converts Varwolf style objects into CSS and injects them
 * into the DOM. Uses different strategies based on environment:
 * - **Development**: Appends CSS as text (easier to inspect in DevTools)
 * - **Production**: Uses insertRule for better performance
 *
 * Handles:
 * - CSS custom properties (--variables)
 * - Regular CSS properties
 * - Pseudo-class styles (:hover, :focus, etc.)
 *
 * Automatically skips injection if the hash is already cached.
 *
 * @param hash - The unique hash identifier for this style combination (e.g., 'vw-12345')
 * @param CSSVars - CSS custom properties with -- prefix (e.g., { '--bg': 'red' })
 * @param regularStyles - Regular CSS properties in camelCase (e.g., { padding: '10px' })
 * @param pseudoClasses - Pseudo-class styles mapped by pseudo-class name (e.g., { hover: { '--bg': 'blue' } })
 *
 * @example
 * ```
 * injectCSS(
 *   'vw-12345',
 *   { '--bg': 'red', '--color': 'white' },
 *   { padding: '10px', display: 'flex' },
 *   { hover: { '--bg': 'blue' }, focus: { '--border': '2px solid' } }
 * )
 *
 * // Generates CSS:
 * // .vw-12345 { --bg: red; --color: white; padding: 10px; display: flex; }
 * // .vw-12345:hover { --bg: blue; }
 * // .vw-12345:focus { --border: 2px solid; }
 * ```
 **/
export function injectCSS(
    hash: string,
    CSSVars: Record<string, string>,
    regularStyles: Record<string, any>,
    pseudoClasses: Record<string, Record<string, string>> = {}
): void {
    // Skip if these styles have already been injected
    if (STYLE_CACHE.has(hash)) {
        return
    }

    const styleTag = fetchStyleTag()
    const CSSRules: string[] = []

    // Combine CSS custom properties and regular styles
    const baseStyles: Record<string, string> = {
        ...CSSVars,
    }

    // Generate base class CSS rule if there are any styles
    for (const [key, value] of Object.entries(regularStyles)) {
        const kebabKey = toKebabCase(key)
        baseStyles[kebabKey] = String(value)
    }

    // Generate pseudo-class CSS rules (e.g., .vw-12345:hover { ... })
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

    // Nothing to inject
    if (CSSRules.length === 0) {
        return
    }

    // Development: Append as textContent for easy CSS inspection in DevTools
    if (isDev()) {
        const CSSText = CSSRules.join("\n") + "\n"

        styleTag.textContent = (styleTag.textContent || "") + CSSText
    } else {
        // Production: Use insertRule for better performance
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

    // Mark this hash as injected to prevent duplicates
    STYLE_CACHE.add(hash)
}

/**
 * Removes all Varwolf-injected styles from the document and clears the cache.
 *
 * Useful for:
 * - Testing and cleanup
 * - Hot module replacement scenarios
 * - Dynamic theme switching that requires full style reset
 *
 * @example
 * ```
 * removeStyles()
 * // All Varwolf CSS removed from document
 * ```
 **/
export function removeStyles(): void {
    const styleTag = document.getElementById(STYLE_TAG_ID)

    if (styleTag) {
        styleTag.remove()
    }

    STYLE_CACHE.clear()
}

/**
 * Returns the number of unique style combinations currently cached.
 *
 * Useful for:
 * - Performance monitoring
 * - Debugging style generation
 * - Understanding cache size in development
 *
 * @returns The number of cached style hashes
 *
 * @example
 * ```
 * console.log(`Cached styles: ${getCacheSize()}`)
 * // Output: "Cached styles: 42"
 * ```
 **/
export function getCacheSize(): number {
    return STYLE_CACHE.size
}

/**
 * Retrieves all injected CSS as a string.
 *
 * Returns the complete CSS content from the Varwolf style tag.
 * Behavior differs by environment:
 * - **Development**: Returns textContent (raw CSS string)
 * - **Production**: Returns cssText from CSSStyleSheet rules
 *
 * Useful for:
 * - Server-side rendering (SSR) CSS extraction
 * - Debugging and inspection
 * - CSS snapshots for testing
 *
 * @returns The complete CSS string, or empty string if no styles exist
 *
 * @example
 * ```
 * const css = getInjectedCSS()
 * console.log(css)
 * // Output:
 * // .vw-12345 { --bg: red; padding: 10px; }
 * // .vw-12345:hover { --bg: blue; }
 * ```
 **/
export function getInjectedCSS(): string {
    const styleTag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement

    if (!styleTag) {
        return ""
    }

    // Development: Return raw textContent
    if (isDev()) {
        return styleTag.textContent || ""
    }

    // Production: Extract from CSSStyleSheet
    if (styleTag.sheet) {
        const rules = Array.from(styleTag.sheet.cssRules)

        return rules.map((rule) => rule.cssText).join("\n")
    }

    return ""
}
