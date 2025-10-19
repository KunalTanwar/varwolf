import React, { forwardRef, type ComponentPropsWithRef, type ComponentRef, type ElementType } from "react"

import type { VarwolfInlineStyles, VarwolfStyles } from "../types"

import { useVarwolf } from "../hooks"
import { toKebabCase } from "../utils"

type VarwolfProps<T extends ElementType> = {
    style?: VarwolfStyles
    inlineStyle?: VarwolfInlineStyles
} & Omit<ComponentPropsWithRef<T>, "style">

type VarwolfRef<T extends ElementType> = ComponentRef<T>

export function createStyledComponent<T extends ElementType>(element: T) {
    const Component = forwardRef<VarwolfRef<T>, VarwolfProps<T>>((props, ref) => {
        const { style, inlineStyle, className, ...restProps } = props as VarwolfProps<T>

        const { className: varwolfClassName } = useVarwolf(style || {})

        const combinedClassName = className ? `${varwolfClassName} ${className}` : varwolfClassName

        const processedInlineStyle = inlineStyle ? processInlineStyle(inlineStyle) : undefined

        return React.createElement(element, {
            ...restProps,
            ref,
            className: combinedClassName,
            style: processedInlineStyle,
        } as any)
    })

    Component.displayName = `Varwolf(${typeof element === "string" ? element : "Component"})`

    return Component
}

function processInlineStyle(inlineStyle: VarwolfInlineStyles): React.CSSProperties {
    const processed: Record<string, any> = {}

    for (const [key, value] of Object.entries(inlineStyle)) {
        if (key.startsWith("__")) {
            const varName = `--${toKebabCase(key.slice(2))}`
            processed[varName] = value
        } else {
            processed[key] = value
        }
    }

    return processed
}
