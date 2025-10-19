import { useMemo } from "react"

import type { VarwolfStyles } from "../types"
import { createStableHash, injectCSS, transformStyles } from "../core"

export interface UseVarwolfResult {
    className: string
}

export function useVarwolf(styles: VarwolfStyles): UseVarwolfResult {
    return useMemo(() => {
        const { CSSVars, regularStyles, pseudoClasses } = transformStyles(styles)
        const hash = createStableHash(styles)

        injectCSS(hash, CSSVars, regularStyles, pseudoClasses)

        return {
            className: hash,
        }
    }, [styles])
}
