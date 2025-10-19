import type { MostCommonPseudoClass } from "../constants"

type VariablePrefix = `__${string}`
type PseudoClassPrefix = `_${MostCommonPseudoClass}`

type VariableValue =
    | string
    | number
    | ((currentValue: string | number, from?: MostCommonPseudoClass) => string | number)

type CSSVariables = {
    [key in VariablePrefix]?: VariableValue
}

type PseudoClasses = {
    [key in PseudoClassPrefix]?: VarwolfStyles
}

export type VarwolfStyles = React.CSSProperties & CSSVariables & PseudoClasses
export type VarwolfInlineStyles = React.CSSProperties & CSSVariables
