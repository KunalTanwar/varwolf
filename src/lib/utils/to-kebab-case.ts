/**
 * Converts a string to kebab-case format.
 *
 * Transforms strings from various naming conventions (camelCase, snake_case,
 * PascalCase, or prefixed with __) into kebab-case. This is essential for
 * converting JavaScript/TypeScript variable names into valid CSS property names.
 *
 * Transformation process:
 * 1. Strips leading `__` prefix (Varwolf CSS variable prefix)
 * 2. Converts all underscores to hyphens
 * 3. Inserts hyphens before uppercase letters following lowercase/digits
 * 4. Converts entire string to lowercase
 *
 * @param str - The string to convert to kebab-case
 * @returns The kebab-cased string
 *
 * @example
 * ```
 * toKebabCase('backgroundColor')
 * // Returns: 'background-color'
 *
 * toKebabCase('__bgColor')
 * // Returns: 'bg-color' (__ prefix removed)
 *
 * toKebabCase('marginTop')
 * // Returns: 'margin-top'
 *
 * toKebabCase('WebkitTransform')
 * // Returns: 'webkit-transform'
 *
 * toKebabCase('border_width')
 * // Returns: 'border-width' (underscore converted)
 *
 * toKebabCase('fontSize16px')
 * // Returns: 'font-size16px'
 * ```
 *
 * @example
 * ```
 * // Used internally for CSS variable transformation
 * const varName = toKebabCase('__bgColor')
 * // Result: 'bg-color'
 * // Then prefixed: '--bg-color'
 * ```
 **/
export const toKebabCase = (str: string) => {
    const output = str
        .replace(/^__/, "") // Remove Varwolf CSS variable prefix
        .replace(/_/g, "-") // Convert underscores to hyphens
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // Insert hyphens before uppercase letters
        .toLowerCase() // Convert to lowercase

    return output
}
