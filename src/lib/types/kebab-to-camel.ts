export type KebabToCamelCase<S extends string> = S extends `${infer First}-${infer Rest}`
    ? `${First}${Capitalize<KebabToCamelCase<Rest>>}`
    : S
