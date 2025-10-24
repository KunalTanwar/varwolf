/**
 * @fileoverview Core TypeScript type definitions for Varwolf styling system
 * @module varwolf/types
 **/
import type { MostCommonPseudoClass } from "../constants"
import type { KebabToCamelCase } from "./kebab-to-camel"

/**
 * Type representing CSS variable keys with the __ prefix.
 *
 * Matches any string that starts with double underscore (__), which is
 * Varwolf's syntax for defining CSS custom properties. The prefix is
 * automatically converted to -- (standard CSS variable prefix) during transformation.
 *
 * @example
 * ```
 * // Valid VariablePrefix values:
 * '__bg'
 * '__color'
 * '__fontSize'
 * '__customProperty'
 * ```
 **/
type VariablePrefix = `__${string}`

/**
 * Type representing pseudo-class keys with the _ prefix in camelCase.
 *
 * Matches supported pseudo-class names prefixed with a single underscore.
 * The pseudo-class name must be in camelCase format (e.g., _hover, _focusVisible).
 * Only the 16 most common pseudo-classes are supported for type safety.
 *
 * @example
 * ```
 * // Valid PseudoClassPrefix values:
 * '_hover'
 * '_focus'
 * '_active'
 * '_disabled'
 * '_focusVisible'
 * '_checked'
 * ```
 **/
type PseudoClassPrefix = `_${KebabToCamelCase<MostCommonPseudoClass>}`

/**
 * Type representing possible values for CSS variables.
 *
 * Supports:
 * - **Static values**: Strings or numbers directly applied to the variable
 * - **Function values**: Computed values that can reference other state variables
 *
 * Function signature:
 * - `currentValue`: The current value of the variable (from base state or parent scope)
 * - `from`: Optional pseudo-class state to reference (e.g., 'hover', 'focus')
 *
 * @example
 * ```
 * // Static value
 * __bg: 'red'
 * __opacity: 0.8
 *
 * // Function value
 * __bg: (current) => current === 'red' ? 'blue' : 'red'
 * __opacity: (current) => Number(current) * 0.8
 *
 * // Function with state reference
 * __bg: (current, from = 'hover') => current
 * ```
 **/
type VariableValue =
    | string
    | number
    | ((currentValue: string | number, from?: MostCommonPseudoClass) => string | number)

/**
 * Type for CSS custom properties (CSS variables) with __ prefix.
 *
 * Allows defining any number of CSS variables using the `__variableName` syntax.
 * Each variable can be a static value (string/number) or a function that computes
 * the value based on other state variables.
 *
 * @example
 * ```
 * const vars: CSSVariables = {
 *   __bg: 'red',
 *   __color: 'white',
 *   __opacity: 1,
 *   __padding: '10px'
 * }
 * ```
 *
 * @example
 * ```
 * // Function-based variables
 * const vars: CSSVariables = {
 *   __opacity: 1,
 *   __hoverOpacity: (current) => Number(current) * 0.8
 * }
 * ```
 **/
type CSSVariables = {
    [key in VariablePrefix]?: VariableValue
}

/**
 * Type for pseudo-class styles with _ prefix.
 *
 * Allows defining nested style objects for pseudo-class states.
 * Each pseudo-class can contain a full VarwolfStyles object, enabling
 * nested pseudo-classes (e.g., :hover:focus) and variable overrides.
 *
 * Only the 16 most common pseudo-classes are supported for type safety
 * and auto-completion.
 *
 * @example
 * ```
 * const pseudos: PseudoClasses = {
 *   _hover: {
 *     __bg: 'blue',
 *     cursor: 'pointer'
 *   },
 *   _focus: {
 *     __borderColor: 'blue',
 *     outline: 'none'
 *   },
 *   _disabled: {
 *     __opacity: 0.5,
 *     cursor: 'not-allowed'
 *   }
 * }
 * ```
 *
 * @example
 * ```
 * // Nested pseudo-classes
 * const nested: PseudoClasses = {
 *   _hover: {
 *     __bg: 'blue',
 *     _focus: {
 *       __bg: 'darkblue'  // :hover:focus
 *     }
 *   }
 * }
 * ```
 **/
type PseudoClasses = {
    [key in PseudoClassPrefix]?: VarwolfStyles
}

/**
 * Complete Varwolf style object type for the `style` prop.
 *
 * Combines:
 * - **React.CSSProperties**: Standard CSS properties (padding, margin, color, etc.)
 * - **CSSVariables**: CSS custom properties with __ prefix
 * - **PseudoClasses**: Pseudo-class states with _ prefix
 *
 * This is the main type used throughout Varwolf for defining styles with
 * full TypeScript support, auto-completion, and type checking.
 *
 * @example
 * ```
 * const styles: VarwolfStyles = {
 *   // Standard CSS
 *   display: 'flex',
 *   padding: '10px',
 *
 *   // CSS variables
 *   __bg: 'red',
 *   __color: 'white',
 *
 *   // Pseudo-classes
 *   _hover: {
 *     __bg: 'blue'
 *   },
 *   _focus: {
 *     __borderColor: 'blue'
 *   }
 * }
 * ```
 *
 * @example
 * ```
 * // Used with varwolf components
 * <varwolf.button style={{
 *   __bg: 'red',
 *   padding: '10px',
 *   _hover: { __bg: 'blue' }
 * }}>
 *   Click me
 * </varwolf.button>
 * ```
 **/
export type VarwolfStyles = React.CSSProperties & CSSVariables & PseudoClasses

/**
 * Varwolf style object type for the `inlineStyle` prop.
 *
 * Similar to VarwolfStyles but **without pseudo-class support**.
 * Used for inline styles where pseudo-classes cannot be applied
 * (since inline styles in React don't support :hover, :focus, etc.).
 *
 * Combines:
 * - **React.CSSProperties**: Standard CSS properties
 * - **CSSVariables**: CSS custom properties with __ prefix
 *
 * Note: For pseudo-class support, use the `style` prop instead.
 *
 * @example
 * ```
 * const inlineStyles: VarwolfInlineStyles = {
 *   // Standard CSS
 *   display: 'block',
 *   margin: '0 auto',
 *
 *   // CSS variables (converted to -- prefix)
 *   __bg: 'red',
 *   __padding: '20px'
 * }
 * ```
 *
 * @example
 * ```
 * // Used with varwolf components
 * <varwolf.div inlineStyle={{
 *   __customVar: 'value',
 *   display: 'flex'
 * }}>
 *   Content
 * </varwolf.div>
 * ```
 **/
export type VarwolfInlineStyles = React.CSSProperties & CSSVariables
