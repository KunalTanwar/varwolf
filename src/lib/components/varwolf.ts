/**
 * @fileoverview Main Varwolf proxy object for accessing styled HTML elements
 * @module varwolf/components/create-styled-varwolf
 **/
import { createStyledComponent } from "./create-styled-component"

/**
 * Type representing the Varwolf proxy object with all HTML elements.
 *
 * Maps every HTML element tag name (from React.JSX.IntrinsicElements) to its
 * corresponding Varwolf-styled component. Enables auto-completion and type
 * safety when accessing elements via `varwolf.div`, `varwolf.button`, etc.
 *
 * @example
 * ```
 * const MyDiv = varwolf.div  // Type: VarwolfComponent<'div'>
 * const MyButton = varwolf.button  // Type: VarwolfComponent<'button'>
 * ```
 **/
export type VarwolfProxy = {
    [K in keyof React.JSX.IntrinsicElements]: ReturnType<typeof createStyledComponent<K>>
}

/**
 * Cache for storing created styled components to avoid recreating them.
 *
 * Maps element tag names to their corresponding styled components.
 * Improves performance by ensuring each element type is only created once.
 *
 * @internal
 **/
const componentCache = new Map<string, ReturnType<typeof createStyledComponent>>()

/**
 * Main Varwolf proxy object providing access to all styled HTML elements.
 *
 * A magical proxy that dynamically creates styled components for any HTML element
 * on-demand. Access any HTML element using dot notation (e.g., `varwolf.div`,
 * `varwolf.button`) and get a fully-typed, styled component with Varwolf capabilities.
 *
 * Features:
 * - Lazy component creation (only created when first accessed)
 * - Automatic caching (each element type created once)
 * - Full TypeScript intellisense for all HTML elements
 * - Zero configuration required
 *
 * The proxy intercepts property access and creates styled components on-the-fly,
 * caching them for subsequent uses.
 *
 * @example
 * ```
 * import { varwolf } from 'varwolf'
 *
 * function MyComponent() {
 *   return (
 *     <varwolf.div style={{ __bg: 'red', _hover: { __bg: 'blue' } }}>
 *       <varwolf.button style={{ __color: 'white' }}>
 *         Click me
 *       </varwolf.button>
 *     </varwolf.div>
 *   )
 * }
 * ```
 *
 * @example
 * ```
 * // All HTML elements are available with full type safety
 * <varwolf.section style={{ __padding: '20px' }}>
 *   <varwolf.h1 style={{ __fontSize: '2rem' }}>Title</varwolf.h1>
 *   <varwolf.p style={{ __color: 'gray' }}>Paragraph</varwolf.p>
 *   <varwolf.input style={{ __border: '1px solid' }} />
 * </varwolf.section>
 * ```
 **/
export const varwolf = new Proxy({} as VarwolfProxy, {
    /**
     * Proxy getter that creates or retrieves cached styled components.
     *
     * When accessing an element (e.g., `varwolf.div`), this handler:
     * 1. Checks if the component is already cached
     * 2. Returns cached component if found
     * 3. Otherwise, creates new styled component
     * 4. Caches it for future use
     * 5. Returns the new component
     *
     * @param _target - The proxy target (unused, empty object)
     * @param element - The HTML element tag name being accessed
     * @returns The styled component for the requested element
     **/
    get(_target, element: string) {
        // Return cached component if it exists
        if (componentCache.has(element)) {
            return componentCache.get(element)
        }

        // Create new styled component for this element
        const component = createStyledComponent(element as React.ElementType)

        // Cache it for future use
        componentCache.set(element, component)

        return component
    },
})
