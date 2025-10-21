import { useRef } from "react"

import type { VarwolfStyles } from "../types"
import { createStableHash, injectCSS, transformStyles } from "../core"

export interface UseVarwolfResult {
    className: string
}

export function useVarwolf(styles: VarwolfStyles): UseVarwolfResult {
    const styleHash = createStableHash(styles)
    const prevHashRef = useRef<string>("")
    const cachedResultRef = useRef<UseVarwolfResult | null>(null)

    if (prevHashRef.current !== styleHash || cachedResultRef.current === null) {
        const { CSSVars, regularStyles, pseudoClasses } = transformStyles(styles)

        injectCSS(styleHash, CSSVars, regularStyles, pseudoClasses)

        cachedResultRef.current = {
            className: styleHash,
        }

        prevHashRef.current = styleHash
    }

    return cachedResultRef.current
}
