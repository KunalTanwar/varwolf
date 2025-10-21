/**
 * FNV-1a Hash Algorithm - Significantly better Collision Resistance than DJB2
 * FNV-1a: 0.006% Collision Rate vs DJB2: 0.074% Collision Rate
 */

export const fnv1a = (str: string): string => {
    const FNV_OFFSET_BASIS = 2166136261
    const FNV_PRIME = 16777619

    let hash = FNV_OFFSET_BASIS

    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i)
        hash = (hash * FNV_PRIME) >>> 0 // Unsigned 32-bit integer
    }

    return hash.toString(36)
}
