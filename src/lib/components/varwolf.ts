import { createStyledComponent } from "./create-styled-component"

export type VarwolfProxy = {
    [K in keyof React.JSX.IntrinsicElements]: ReturnType<typeof createStyledComponent<K>>
}

const componentCache = new Map<string, ReturnType<typeof createStyledComponent>>()

export const varwolf = new Proxy({} as VarwolfProxy, {
    get(_target, element: string) {
        if (componentCache.has(element)) {
            return componentCache.get(element)
        }

        const component = createStyledComponent(element as React.ElementType)
        componentCache.set(element, component)

        return component
    },
})
