/**
 * @fileoverview Main React hook for Varwolf styling system
 * @module varwolf/hooks/use-varwolf
 **/
import { useRef } from "react"

import type { VarwolfStyles } from "../types"
import { createStableHash, injectCSS, transformStyles } from "../core"

/**
 * Result object returned by the useVarwolf hook.
 *
 * @property className - The stable CSS class name to apply to elements
 **/
export interface UseVarwolfResult {
    className: string
}

/**
 * React hook for generating dynamic CSS-in-JS styles with CSS variables and pseudo-classes.
 *
 * The core hook of the Varwolf styling system. Converts a style object into a stable
 * CSS class name and automatically injects the corresponding styles into the document.
 *
 * Features:
 * - **Stable class generation**: Same styles always produce the same class name
 * - **CSS variable support**: Use `__` prefix for CSS custom properties
 * - **Pseudo-class support**: Use `_` prefix for :hover, :focus, etc.
 * - **Automatic CSS injection**: Styles are injected once and cached
 * - **Optimized memoization**: Uses ref-based caching to prevent unnecessary re-renders
 * - **Hash-based comparison**: Only re-processes when style object content changes
 *
 * The hook uses a stable hashing strategy to detect changes, avoiding React's useMemo
 * dependency issues with object references. Styles are transformed and injected only
 * when the hash changes, ensuring optimal performance.
 *
 * @param styles - Varwolf style object with CSS properties, variables (__prefix), and pseudo-classes (_prefix)
 * @returns Object containing the stable className to apply to elements
 *
 * @example
 * ```
 * import { useVarwolf } from 'varwolf'
 *
 * function Button() {
 *   const { className } = useVarwolf({
 *     __bg: 'red',           // CSS variable: --bg
 *     padding: '10px',       // Regular CSS property
 *     _hover: {              // Pseudo-class
 *       __bg: 'blue'
 *     }
 *   })
 *
 *   return <button className={className}>Click me</button>
 * }
 * ```
 *
 * @example
 * ```
 * // Dynamic styles with state
 * function DynamicButton() {
 *   const [color, setColor] = useState('red')
 *
 *   const { className } = useVarwolf({
 *     __bg: color,
 *     _hover: { __bg: 'blue' }
 *   })
 *
 *   return <button className={className}>Dynamic</button>
 * }
 * ```
 *
 * @example
 * ```
 * // Function-based variables
 * function AnimatedButton() {
 *   const { className } = useVarwolf({
 *     __opacity: 1,
 *     _hover: {
 *       __opacity: (current) => Number(current) * 0.8
 *     }
 *   })
 *
 *   return <button className={className}>Fade on hover</button>
 * }
 * ```
 *
 * @example
 * ```
 * // Compound pseudo-classes
 * function Input() {
 *   const { className } = useVarwolf({
 *     __borderColor: 'gray',
 *     _focus: {
 *       __borderColor: 'blue',
 *       _hover: {
 *         __borderColor: 'darkblue'  // :focus:hover
 *       }
 *     }
 *   })
 *
 *   return <input className={className} />
 * }
 * ```
 **/
export function useVarwolf(styles: VarwolfStyles): UseVarwolfResult {
    // Generate stable hash from style object content
    const styleHash = createStableHash(styles)

    // Store previous hash for change detection
    const prevHashRef = useRef<string>("")

    // Cache the result to maintain stable reference
    const cachedResultRef = useRef<UseVarwolfResult | null>(null)

    // Only process and inject styles if hash has changed
    if (prevHashRef.current !== styleHash || cachedResultRef.current === null) {
        // Transform Varwolf styles into CSS-ready format
        const { CSSVars, regularStyles, pseudoClasses } = transformStyles(styles)

        // Inject CSS into document (no-op if already injected)
        injectCSS(styleHash, CSSVars, regularStyles, pseudoClasses)

        // Cache the result
        cachedResultRef.current = {
            className: styleHash,
        }

        // Update previous hash
        prevHashRef.current = styleHash
    }

    // Return cached result (stable reference)
    return cachedResultRef.current
}
