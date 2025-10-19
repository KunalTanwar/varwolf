export const toKebabCase = (str: string) => {
    const output = str
        .replace(/^__/, "")
        .replace(/_/g, "-")
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .toLowerCase()

    return output
}
