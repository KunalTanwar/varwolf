import { fnv1a, toStableString } from "../utils"

export function createStableHash(value: any) {
    const stableString = toStableString(value)
    const hash = fnv1a(stableString)

    return `vw-${hash}`
}
