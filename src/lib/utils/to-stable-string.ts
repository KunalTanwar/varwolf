export const toStableString = (value: any): string => {
    if (value === null) {
        return "null"
    }

    if (value === undefined) {
        return "undefined"
    }

    const valueType = typeof value

    if (valueType === "string") return `"${value}"`
    if (valueType === "number") return String(value)
    if (valueType === "boolean") return String(value)

    if (valueType === "function") {
        return value.toString().replace(/\s+/g, " ").trim()
    }

    if (Array.isArray(value)) {
        const items = value.map(toStableString).join(",")

        return `[${items}]`
    }

    if (valueType === "object") {
        const keys = Object.keys(value).sort()
        const pairs = keys.map((key) => {
            const serializedValue = toStableString(value[key])

            return `"${key}":${serializedValue}`
        })

        return `{${pairs.join(",")}}`
    }

    return String(value)
}
