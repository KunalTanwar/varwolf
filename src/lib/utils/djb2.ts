export const djb2 = (str: string) => {
    let hash = 5381

    for (let i = 0; i < str.length; i++) {
        const characterCode = str.charCodeAt(i)

        hash = (hash << 5) + hash + characterCode
    }

    return (hash >>> 0).toString(36)
}
