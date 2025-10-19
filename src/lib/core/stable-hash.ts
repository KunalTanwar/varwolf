import { djb2, toStableString } from "../utils"

export function createStableHash(value: any) {
    const stableString = toStableString(value)
    const hash = djb2(stableString)

    return `vw-${hash}`
}
