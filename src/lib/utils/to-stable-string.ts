export const toStableString = (value: any): string => {
    return JSON.stringify(value, (_key, val) => {
        if (val === null) return val

        if (typeof val === "bigint") {
            return val.toString()
        }

        if (typeof val === "function") {
            return val.toString().replace(/\s+/g, " ").trim()
        }

        if (val && typeof val === "object" && !Array.isArray(val)) {
            if (val instanceof Date || val instanceof RegExp) {
                return val.toString()
            }

            return Object.keys(val)
                .sort()
                .reduce((acc, k) => {
                    acc[k] = val[k]
                    return acc
                }, {} as Record<string, any>)
        }

        return val
    })
}
