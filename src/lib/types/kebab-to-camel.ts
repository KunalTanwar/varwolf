/**
 * TypeScript utility type that transforms kebab-case strings to camelCase at the type level.
 *
 * Recursively processes string literal types, converting hyphenated strings into
 * camelCase equivalents. This is useful for maintaining type safety when converting
 * between different naming conventions (e.g., CSS properties to JavaScript property names).
 *
 * The transformation works by:
 * 1. Detecting the first hyphen in the string
 * 2. Keeping everything before the hyphen lowercase
 * 3. Capitalizing the first character after the hyphen
 * 4. Recursively processing the remainder of the string
 * 5. Returning the original string if no hyphens are found
 *
 * @template S - The string literal type to transform (must extend string)
 *
 * @example
 * ```
 * type Test1 = KebabToCamelCase<'background-color'>
 * // Result: 'backgroundColor'
 *
 * type Test2 = KebabToCamelCase<'border-top-width'>
 * // Result: 'borderTopWidth'
 *
 * type Test3 = KebabToCamelCase<'padding'>
 * // Result: 'padding' (no change, no hyphens)
 *
 * type Test4 = KebabToCamelCase<'my-custom-css-property'>
 * // Result: 'myCustomCssProperty'
 * ```
 *
 * @example
 * ```
 * // Used in CSS variable transformations
 * type CSSVar = '--bg-color' | '--text-size'
 * type JSVar = KebabToCamelCase<CSSVar>
 * // Result: '--bgColor' | '--textSize'
 * ```
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
 **/
export type KebabToCamelCase<S extends string> = S extends `${infer First}-${infer Rest}`
    ? `${First}${Capitalize<KebabToCamelCase<Rest>>}`
    : S
