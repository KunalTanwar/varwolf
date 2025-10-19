const ANGLE_UNITS = new Set(["deg", "grad", "rad", "turn"])

const CONTAINER_UNITS = new Set(["cqb", "cqh", "cqi", "cqmax", "cqmin", "cqw"])

const FREQUENCY_UNITS = new Set(["Hz", "kHz"])

const GRID_UNITS = new Set(["fr"])

const LENGTH_UNITS = new Set([
    "cap",
    "ch",
    "cm",
    "em",
    "ex",
    "ic",
    "in",
    "lh",
    "mm",
    "pc",
    "pt",
    "px",
    "rcap",
    "rch",
    "rem",
    "rex",
    "ric",
    "rlh",
])

const PERCENTAGE_UNITS = new Set(["%"])

const RESOLUTION_UNITS = new Set(["dpcm", "dpi", "dppx", "x"])

const TIME_UNITS = new Set(["ms", "s"])

const VIEWPORT_UNITS = new Set([
    "dvb",
    "dvh",
    "dvi",
    "dvmax",
    "dvmin",
    "dvw",
    "lvb",
    "lvh",
    "lvi",
    "lvmax",
    "lvmin",
    "lvw",
    "svb",
    "svh",
    "svi",
    "svmax",
    "svmin",
    "svw",
    "vb",
    "vh",
    "vi",
    "vmax",
    "vmin",
    "vw",
])

export const VALID_CSS_UNITS = new Set([
    ...ANGLE_UNITS,
    ...CONTAINER_UNITS,
    ...FREQUENCY_UNITS,
    ...GRID_UNITS,
    ...LENGTH_UNITS,
    ...PERCENTAGE_UNITS,
    ...RESOLUTION_UNITS,
    ...TIME_UNITS,
    ...VIEWPORT_UNITS,
])
