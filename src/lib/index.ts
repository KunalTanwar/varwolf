/**
 * @fileoverview Main entry point for the Varwolf CSS-in-JS library
 * @module varwolf
 *
 * @example
 * ```
 * import { varwolf, useVarwolf } from 'varwolf'
 * import type { VarwolfStyles } from 'varwolf'
 * ```
 */

/**
 * Main Varwolf proxy object for accessing styled HTML elements.
 *
 * The primary way to use Varwolf - provides access to all HTML elements
 * as styled components with CSS variable and pseudo-class support.
 *
 * @example
 * ```
 * import { varwolf } from 'varwolf'
 *
 * function MyComponent() {
 *   return (
 *     <varwolf.div style={{ __bg: 'red', _hover: { __bg: 'blue' } }}>
 *       <varwolf.button style={{ __color: 'white' }}>
 *         Click me
 *       </varwolf.button>
 *     </varwolf.div>
 *   )
 * }
 * ```
 *
 * @see {@link VarwolfProxy} for the complete type definition
 */
export { varwolf } from "./components"

/**
 * Type definitions for Varwolf style objects.
 *
 * - **VarwolfStyles**: Complete style type with CSS variables (__), pseudo-classes (_), and standard CSS
 * - **VarwolfInlineStyles**: Style type for inline styles (no pseudo-class support)
 *
 * @example
 * ```
 * import type { VarwolfStyles, VarwolfInlineStyles } from 'varwolf'
 *
 * const styles: VarwolfStyles = {
 *   __bg: 'red',
 *   padding: '10px',
 *   _hover: { __bg: 'blue' }
 * }
 *
 * const inlineStyles: VarwolfInlineStyles = {
 *   __customVar: 'value',
 *   margin: '20px'
 * }
 * ```
 */
export type { VarwolfStyles, VarwolfInlineStyles } from "./types"

/**
 * React hook for generating dynamic CSS-in-JS styles with CSS variables and pseudo-classes.
 *
 * Use this hook when you need:
 * - Direct access to the generated className
 * - Dynamic style generation based on component state
 * - Integration with non-Varwolf components
 * - Custom styling logic
 *
 * @example
 * ```
 * import { useVarwolf } from 'varwolf'
 *
 * function CustomButton() {
 *   const [isActive, setIsActive] = useState(false)
 *
 *   const { className } = useVarwolf({
 *     __bg: isActive ? 'blue' : 'red',
 *     padding: '10px',
 *     _hover: { __bg: 'darkblue' }
 *   })
 *
 *   return <button className={className}>Custom</button>
 * }
 * ```
 *
 * @see {@link UseVarwolfResult} for the return type
 */
export { useVarwolf } from "./hooks"

/**
 * TypeScript type for the Varwolf proxy object.
 *
 * Maps all HTML element tag names to their corresponding Varwolf-styled components.
 * Provides full type safety and auto-completion when accessing elements via `varwolf.element`.
 *
 * @example
 * ```
 * import type { VarwolfProxy } from 'varwolf'
 *
 * // Type-safe access to all HTML elements
 * const proxy: VarwolfProxy = varwolf
 * const Div = proxy.div
 * const Button = proxy.button
 * ```
 *
 * @example
 * ```
 * // Use for creating custom abstractions
 * function createCustomComponent<T extends keyof VarwolfProxy>(
 *   element: T
 * ): VarwolfProxy[T] {
 *   return varwolf[element]
 * }
 * ```
 */
export type { VarwolfProxy } from "./components"
