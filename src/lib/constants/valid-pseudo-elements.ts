export const PSEUDO_ELEMENTS = [
    "after",
    "backdrop",
    "before",
    "firstLetter",
    "firstLine",
    "marker",
    "placeholder",
    "selection",
] as const

export const PSEUDO_ELEMENTS_SET = new Set(PSEUDO_ELEMENTS)
export type PseudoElement = (typeof PSEUDO_ELEMENTS)[number]
