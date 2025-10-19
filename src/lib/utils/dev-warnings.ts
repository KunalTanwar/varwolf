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

    console.warn(`[Varwolf Warning] ${message}`, ...details.map((d) => `\n${d}`))
}

export function devError(message: string, ...details: string[]): void {
    console.error(`[Varwolf Error] ${message}`, ...details.map((d) => `\n${d}`))
}

export function isDev(): boolean {
    return IS_DEV
}
