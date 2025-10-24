/**
 * @fileoverview Factory function for creating styled Varwolf components with forwarded refs
 * @module varwolf/components/create-styled-component
 **/
import React, { forwardRef, type ComponentPropsWithRef, type ComponentRef, type ElementType } from "react"

import type { VarwolfInlineStyles, VarwolfStyles } from "../types"

import { useVarwolf } from "../hooks"
import { toKebabCase } from "../utils"

/**
 * Props type for Varwolf-enhanced components
 *
 * @template T - The element type (HTML tag or React component)
 *
 * @property style - Varwolf styles with CSS variables (__) and pseudo-classes (_)
 * @property inlineStyle - Inline styles with CSS variable support (__prefix only)
 **/
type VarwolfProps<T extends ElementType> = {
    style?: VarwolfStyles
    inlineStyle?: VarwolfInlineStyles
} & Omit<ComponentPropsWithRef<T>, "style">

/**
 * Ref type for Varwolf-enhanced components
 *
 * @template T - The element type being wrapped
 **/
type VarwolfRef<T extends ElementType> = ComponentRef<T>

/**
 * Creates a styled component wrapper with Varwolf styling capabilities.
 *
 * Wraps any HTML element or React component with Varwolf's CSS-in-JS system,
 * supporting CSS variables, pseudo-classes, and ref forwarding. The component
 * automatically handles style injection and class name generation.
 *
 * Features:
 * - Full TypeScript type safety for wrapped elements
 * - Ref forwarding with proper typing
 * - CSS variable support (__ prefix converts to -- CSS variables)
 * - Pseudo-class support (_ prefix for :hover, :focus, etc.)
 * - Automatic class name merging
 * - Inline style processing with CSS variable support
 *
 * @template T - The element type to wrap (e.g., 'div', 'button', CustomComponent)
 * @param element - The HTML tag name or React component to wrap
 * @returns A forwardRef-wrapped component with Varwolf styling support
 *
 * @example
 * ```
 * // Create a styled div
 * const StyledDiv = createStyledComponent('div')
 *
 * // Usage
 * <StyledDiv
 *   style={{ __bg: 'red', _hover: { __bg: 'blue' } }}
 *   inlineStyle={{ __color: 'white' }}
 * />
 * ```
 *
 * @example
 * ```
 * // Wrap custom component
 * const CustomButton = (props) => <button {...props} />
 * const StyledButton = createStyledComponent(CustomButton)
 * ```
 **/
export function createStyledComponent<T extends ElementType>(element: T) {
    const Component = forwardRef<VarwolfRef<T>, VarwolfProps<T>>((props, ref) => {
        const { style, inlineStyle, className, ...restProps } = props as VarwolfProps<T>

        // Generate stable CSS class name and inject styles into document
        const { className: varwolfClassName } = useVarwolf(style || {})

        // Merge user-provided className with generated Varwolf className
        const combinedClassName = className ? `${varwolfClassName} ${className}` : varwolfClassName

        // Convert inline style CSS variables (__prefix) to CSS custom properties (--prefix)
        const processedInlineStyle = inlineStyle ? processInlineStyle(inlineStyle) : undefined

        const elementProps = {
            ...restProps,
            ref,
            className: combinedClassName,
            style: processedInlineStyle,
        }

        return React.createElement(element, elementProps)
    })

    // Set display name for better debugging in React DevTools
    Component.displayName = `Varwolf(${typeof element === "string" ? element : "Component"})`

    return Component
}

/**
 * Processes inline styles to convert Varwolf CSS variable syntax to native CSS custom properties.
 *
 * Transforms `__variableName` keys into `--variable-name` CSS custom properties.
 * Regular CSS properties pass through unchanged.
 *
 * Note: Inline styles only support CSS variables, not pseudo-classes.
 * For pseudo-classes, use the `style` prop instead.
 *
 * @param inlineStyle - The inline style object with possible __prefix variables
 * @returns Processed style object with CSS custom properties (--prefix)
 *
 * @example
 * ```
 * processInlineStyle({ __bgColor: 'red', padding: '10px' })
 * // Returns: { '--bg-color': 'red', padding: '10px' }
 * ```
 *
 * @internal Used internally by createStyledComponent
 **/
function processInlineStyle(inlineStyle: VarwolfInlineStyles): React.CSSProperties {
    const processed: Record<string, any> = {}

    // Convert __camelCase to --kebab-case CSS custom property
    for (const [key, value] of Object.entries(inlineStyle)) {
        if (key.startsWith("__")) {
            const varName = `--${toKebabCase(key.slice(2))}`
            processed[varName] = value
        } else {
            // Pass through regular CSS properties unchanged
            processed[key] = value
        }
    }

    return processed
}
