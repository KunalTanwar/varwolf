import type { KebabToCamelCase } from "../types/kebab-to-camel"

const EXPERIMENTAL_PSEUDO_CLASSES = [
    "blank",
    "heading", // 🧪
    "local-link",
] as const

const FUNCTIONAL_PSEUDO_CLASSES = [
    "dir",
    "has",
    "is",
    "lang",
    "not",
    "nth-child",
    "nth-last-child",
    "nth-last-of-type",
    "nth-of-type",
    "state", // 🧪
    "where",
] as const

const STANDARD_PSEUDO_CLASSES = [
    "active",
    "any-link",
    "autofill",
    "buffering",
    "checked",
    "default",
    "defined",
    "disabled",
    "empty",
    "enabled",
    "first-child",
    "first-of-type",
    "focus-visible",
    "focus-within",
    "focus",
    "fullscreen",
    "hover",
    "in-range",
    "indeterminate",
    "invalid",
    "last-child",
    "last-of-type",
    "link",
    "modal",
    "muted",
    "only-child",
    "only-of-type",
    "open",
    "optional",
    "out-of-range",
    "paused",
    "picture-in-picture",
    "placeholder-shown",
    "playing",
    "popover-open",
    "read-only",
    "read-write",
    "required",
    "seeking",
    "stalled",
    "target",
    "user-invalid",
    "user-valid",
    "valid",
    "visited",
    "volume-locked",
] as const

const MOST_COMMON_PSEUDO_CLASSES = [
    "active",
    "checked",
    "disabled",
    "enabled",
    "first-child",
    "focus-visible",
    "focus-within",
    "focus",
    "hover",
    "invalid",
    "last-child",
    "link",
    "placeholder-shown",
    "required",
    "valid",
    "visited",
] as const

export const MOST_COMMON_PSEUDO_CLASSES_SET = new Set(MOST_COMMON_PSEUDO_CLASSES)

export const VALID_PSEUDO_CLASSES = new Set([
    ...EXPERIMENTAL_PSEUDO_CLASSES,
    ...FUNCTIONAL_PSEUDO_CLASSES,
    ...STANDARD_PSEUDO_CLASSES,
])

export type MostCommonPseudoClass = KebabToCamelCase<(typeof MOST_COMMON_PSEUDO_CLASSES)[number]>
export type ValidPseudoClass =
    | (typeof EXPERIMENTAL_PSEUDO_CLASSES)[number]
    | (typeof FUNCTIONAL_PSEUDO_CLASSES)[number]
    | (typeof STANDARD_PSEUDO_CLASSES)[number]
