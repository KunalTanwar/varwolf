/**
 * Varwolf - A lightweight CSS-in-JS library with CSS variables and pseudo-classes
 * @packageDocumentation
 **/

// ============================================================================
// PRIMARY API - Most users will only need these
// ============================================================================

/**
 * Main Varwolf component proxy for styling HTML elements.
 *
 * @example
 * ```
 * import { varwolf } from 'varwolf'
 *
 * function App() {
 *   return (
 *     <varwolf.div style={{
 *       __bg: 'red',
 *       backgroundColor: 'var(--bg)',
 *       _hover: { __bg: 'blue' }
 *     }}>
 *       Hover me!
 *     </varwolf.div>
 *   )
 * }
 * ```
 **/
export { varwolf } from "./components"

/**
 * Type definitions for Varwolf styles.
 * Use this for typing component props that accept Varwolf styles.
 *
 * @example
 * ```
 * import type { VarwolfStyles } from 'varwolf'
 *
 * interface CardProps {
 *   style?: VarwolfStyles
 *   children: React.ReactNode
 * }
 * ```
 **/
export type { VarwolfStyles, VarwolfInlineStyles } from "./types"

// ============================================================================
// ADVANCED API - For power users and special cases
// ============================================================================

/**
 * Hook that transforms Varwolf styles and returns className + style.
 * Use this for custom components or third-party library integration.
 *
 * @example
 * ```
 * import { useVarwolf } from 'varwolf'
 * import { Button } from '@mui/material'
 *
 * function MyButton() {
 *   const { className, style } = useVarwolf({
 *     __bg: 'red',
 *     backgroundColor: 'var(--bg)',
 *     _hover: { __bg: 'darkred' }
 *   })
 *
 *   return <Button className={className} style={style}>Click me</Button>
 * }
 * ```
 **/
export { useVarwolf } from "./hooks"

/**
 * Type for the varwolf proxy object.
 * Useful for extending or referencing the varwolf proxy type.
 *
 * @example
 * ```
 * import type { VarwolfProxy } from 'varwolf'
 *
 * const myComponents: VarwolfProxy = varwolf
 * ```
 **/
export type { VarwolfProxy } from "./components"
