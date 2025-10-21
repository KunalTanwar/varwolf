const IS_DEV = process.env.NODE_ENV === "development"

let warningsEnabled = true

export function disableWarnings(): void {
    warningsEnabled = false
}

export function enableWarnings(): void {
    warningsEnabled = true
}

export function devWarn(message: string, ...details: string[]): void {
    if (!IS_DEV || !warningsEnabled) return

    console.warn("%c[Varwolf Warning] :", "font-weight: 700", `${message}`, ...details.map((detail) => `\n${detail}`))
}

export function devError(message: string, ...details: string[]): void {
    console.error("%c[Varwolf Error] :", "font-weight: 700", `${message}`, ...details.map((detail) => `\n${detail}`))
}

export function isDev(): boolean {
    return IS_DEV
}
