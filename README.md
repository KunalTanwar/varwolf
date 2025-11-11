# 🐺 Varwolf

**A Modern CSS Variable Manipulation Library for React.**

Varwolf lets you dynamically control CSS variables with a clean, type-safe API. Write styles with pseudo-classes, pseudo-elements, variable groups, and dynamic values — all while maintaining the performance and specificity benefits of CSS-in-JS.

## ✨ Features

-   🎯 **CSS Variable-First** — Manipulate CSS custom properties, not just styles
-   🔄 **Dynamic State Management** — Variables change with pseudo-classes (`:hover`, `:active`, etc.)
-   📦 **Variable Groups** — Organize related variables with nested objects (NEW in v1.2.0)
-   ✨ **Pseudo-Elements** — Style `::before`, `::after`, and more with `$` prefix
-   🪆 **Nested Pseudo-Selectors** — Support for complex states like `:hover:disabled`
-   🔗 **Cross-State References** — Reference values from other pseudo-states
-   📐 **`currentValue` Functions** — Modify existing values instead of replacing them
-   ⚡ **Hybrid Rendering** — Stylesheet for static styles, inline for dynamic values
-   🎨 **Full TypeScript Support** — Complete type safety with autocomplete
-   🧩 **Zero Dependencies** — Ultra-lightweight (~2KB gzipped) - Smallest CSS-in-JS library!
-   🚀 **Performance Optimized** — Smart caching, stable hashing, lazy variable generation

## 📦 Installation

```bash
# npm
npm install varwolf

# yarn
yarn add varwolf

# pnpm
pnpm add varwolf
```

## 🚀 Quick Start

```tsx
import { varwolf } from "varwolf"

function App() {
    return (
        <varwolf.button
            style={{
                __bgColor: "blue",
                __scale: 1,

                backgroundColor: "var(--bg-color)",
                transform: "scale(var(--scale))",
                padding: "10px 20px",
                border: "none",
                color: "white",

                _hover: {
                    __bgColor: "darkblue",
                    __scale: 1.1,
                },
                _active: {
                    __scale: 0.95,
                },

                $before: {
                    content: "→",
                    marginRight: "5px",
                },
            }}
        >
            Click me!
        </varwolf.button>
    )
}
```

## 📖 Core Concepts

### CSS Variables (`__` prefix)

Define CSS custom properties with the `__` prefix:

```tsx
<varwolf.div
    style={{
        __primary: "blue",
        __importance: 16,

        backgroundColor: "var(--primary)",
        zIndex: "var(--importance)",
    }}
/>
```

**Generates:**

```css
.vw-abc123 {
    --primary: blue;
    --importance: 16;
    background-color: var(--primary);
    z-index: var(--importance);
}
```

### Variable Groups

**NEW in v1.2.0:** Organize related variables with nested objects. Only used variables are generated for optimal performance.

```tsx
<varwolf.div
    style={{
        __spacing: {
            xs: "4px",
            sm: "8px",
            md: "16px",
            lg: "24px",
            xl: "32px",
        },

        __colors: {
            primary: "#0070f3",
            secondary: "#7928ca",
            success: "#00ff00",
        },

        padding: "var(--spacing-md)",
        backgroundColor: "var(--colors-primary)",
    }}
/>
```

**Generates (only used variables):**

```css
.vw-abc123 {
    --spacing-md: 16px;
    --colors-primary: #0070f3;
    padding: var(--spacing-md);
    background-color: var(--colors-primary);
}
```

**Key Benefits:**

-   🎯 **Lazy Generation**: Only injects variables you actually use
-   📦 **Organization**: Group related variables (spacing, colors, typography)
-   🔄 **Partial Updates**: Override individual values in pseudo-classes
-   ⚡ **Performance**: Reduces CSS output size

**Partial Updates in Pseudo-Classes:**

```tsx
<varwolf.div
    style={{
        __spacing: {
            xs: "4px",
            sm: "8px",
            md: "16px",
        },

        padding: "var(--spacing-md)",

        _hover: {
            __spacing: {
                md: "20px", // Only override this one value
            },
        },
    }}
/>
```

### Pseudo-Classes (`_` prefix)

Change variables on pseudo-states using camelCase:

```tsx
<varwolf.button
    style={{
        __bgColor: "blue",
        backgroundColor: "var(--bg-color)",

        _hover: {
            __bgColor: "darkblue",
        },
        _active: {
            __bgColor: "navy",
        },
        _disabled: {
            __bgColor: "gray",
        },
    }}
>
    Button
</varwolf.button>
```

**Generates:**

```css
.vw-abc123 {
    --bg-color: blue;
    background-color: var(--bg-color);
}
.vw-abc123:hover {
    --bg-color: darkblue;
}
.vw-abc123:active {
    --bg-color: navy;
}
.vw-abc123:disabled {
    --bg-color: gray;
}
```

### Pseudo-Elements (`$` prefix)

Style `::before`, `::after`, and other pseudo-elements with the `$` prefix:

```tsx
<varwolf.button
    style={{
        __iconColor: "white",
        backgroundColor: "blue",
        padding: "10px 20px",

        $before: {
            content: "→",
            marginRight: "5px",
            color: "var(--icon-color)",
        },

        _hover: {
            __iconColor: "yellow",
            backgroundColor: "darkblue",
        },
    }}
>
    Next
</varwolf.button>
```

**Generates:**

```css
.vw-abc123 {
    --icon-color: white;
    background-color: blue;
    padding: 10px 20px;
}
.vw-abc123::before {
    content: "→";
    margin-right: 5px;
    color: var(--icon-color);
}
.vw-abc123:hover {
    --icon-color: yellow;
    background-color: darkblue;
}
```

#### Supported Pseudo-Elements

```plaintext
::after           — $after
::backdrop        — $backdrop (for dialogs)
::before          — $before
::first-letter    — $firstLetter
::first-line      — $firstLine
::marker          — $marker (for list items)
::placeholder     — $placeholder (for inputs)
::selection       — $selection
```

#### Real-World Examples

**Icon Badge:**

```tsx
<varwolf.button
    style={{
        position: "relative",
        padding: "10px 20px",

        $after: {
            content: "3",
            position: "absolute",
            top: "-8px",
            right: "-8px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            __badge: "red",
            backgroundColor: "var(--badge)",
            color: "white",
            fontSize: "12px",
        },
    }}
>
    Notifications
</varwolf.button>
```

**Decorative Underline:**

```tsx
<varwolf.h2
    style={{
        position: "relative",
        paddingBottom: "10px",

        $after: {
            content: "",
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "50px",
            height: "3px",
            __accent: "#0070f3",
            backgroundColor: "var(--accent)",
        },
    }}
>
    Section Title
</varwolf.h2>
```

**Custom Selection Color:**

```tsx
<varwolf.p
    style={{
        $selection: {
            backgroundColor: "yellow",
            color: "black",
        },
    }}
>
    Try selecting this text!
</varwolf.p>
```

### Static vs Dynamic Styles

Varwolf supports two types of styles for optimal performance:

#### **`style` prop** — Stylesheet Rendering

Use for static styles, pseudo-classes, and pseudo-elements:

```tsx
<varwolf.button
    style={{
        backgroundColor: "red",
        padding: "10px 20px",

        _hover: {
            backgroundColor: "darkred",
        },

        $before: {
            content: "→",
        },
    }}
>
    Static styles
</varwolf.button>
```

#### **`inlineStyle` prop** — Inline Rendering

Use for frequently changing values (animations, scroll effects, drag positions):

```tsx
function Parallax() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <varwolf.div
            style={{
                // Static styles in stylesheet
                backgroundColor: "blue",
                _hover: { backgroundColor: "darkblue" },
            }}
            inlineStyle={{
                // Dynamic values inline (60fps updates)
                transform: `translateY(${scrollY * 0.5}px)`,
            }}
        >
            Parallax effect
        </varwolf.div>
    )
}
```

#### **Hybrid Approach**

Combine both for maximum flexibility:

```tsx
function DynamicButton() {
    const [hue, setHue] = useState(200)

    return (
        <varwolf.button
            style={{
                // Stylesheet: Uses CSS variable
                backgroundColor: "var(--primary-color)",
                padding: "10px 20px",

                _hover: {
                    filter: "brightness(0.9)",
                },
            }}
            inlineStyle={{
                // Inline: Sets variable dynamically
                __primaryColor: `hsl(${hue}, 70%, 50%)`,
            }}
        >
            Dynamic theming
        </varwolf.button>
    )
}
```

### Nested Pseudo-Selectors

Combine multiple pseudo-classes:

```tsx
<varwolf.button
    style={{
        __opacity: 1,
        opacity: "var(--opacity)",

        _hover: {
            __opacity: 0.8,

            _disabled: {
                // :hover:disabled
                __opacity: 0.5,
            },
        },
    }}
>
    Hover me
</varwolf.button>
```

**Generates:**

```css
.vw-abc123 {
    --opacity: 1;
    opacity: var(--opacity);
}
.vw-abc123:hover {
    --opacity: 0.8;
}
.vw-abc123:hover:disabled {
    --opacity: 0.5;
}
```

### `currentValue` Functions

Modify existing values instead of replacing them:

```tsx
<varwolf.div
    style={{
        __size: 16,
        fontSize: "var(--size)px",

        _hover: {
            __size: (currentValue) => Number(currentValue) * 1.2, // 16 → 19.2
        },
    }}
>
    Text grows on hover
</varwolf.div>
```

### Cross-State References (`from` parameter)

Reference values from other pseudo-states:

```tsx
<varwolf.button
    style={{
        __scale: 1,
        transform: "scale(var(--scale))",

        _hover: {
            __scale: 1.2,
        },
        _active: {
            // Get value from :hover state, not base
            __scale: (currentValue, from = "hover") => Number(currentValue) * 0.9,
            // Result: 1.2 * 0.9 = 1.08 (not 1 * 0.9 = 0.9)
        },
    }}
>
    Press me
</varwolf.button>
```

## 🎨 Advanced Usage

### Design System with Variable Groups

Create a reusable design system:

```tsx
const designSystem = {
    __spacing: {
        xxs: "2px",
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
    },

    __colors: {
        primary: "#0070f3",
        secondary: "#7928ca",
        success: "#00ff00",
        error: "#ff0000",
    },

    __fontSize: {
        xs: "12px",
        sm: "14px",
        md: "16px",
        lg: "18px",
        xl: "24px",
    },
}

// Use in components - only injects variables you actually use!
<varwolf.button
    style={{
        ...designSystem,
        padding: "var(--spacing-md)",
        fontSize: "var(--font-size-md)",
        backgroundColor: "var(--colors-primary)",
    }}
>
    Button
</varwolf.button>
```

### Variable Composition

Compose complex values from multiple variables:

```tsx
<varwolf.div
    style={{
        __hue: 200,
        __saturation: 50,
        __lightness: 50,

        backgroundColor: "hsl(var(--hue), var(--saturation)%, var(--lightness)%)",

        _hover: {
            __lightness: (cv) => Number(cv) + 10, // Lighten on hover
        },
    }}
>
    Hover to lighten
</varwolf.div>
```

### Dynamic Theming

```tsx
function ThemedButton() {
    const [theme, setTheme] = useState("light")

    return (
        <varwolf.button
            style={{
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
                padding: "10px 20px",
                border: "1px solid var(--border-color)",

                _hover: {
                    __bgColor: theme === "light" ? "#f0f0f0" : "#333",
                },
            }}
            inlineStyle={{
                __bgColor: theme === "light" ? "white" : "black",
                __textColor: theme === "light" ? "black" : "white",
                __borderColor: theme === "light" ? "#ccc" : "#555",
            }}
        >
            Themed Button
        </varwolf.button>
    )
}
```

### Scroll-Reactive Styles

```tsx
function ScrollCard() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scale = 1 + scrollY / 1000
    const opacity = Math.max(0, 1 - scrollY / 500)

    return (
        <varwolf.div
            style={{
                backgroundColor: "blue",
                padding: "100px",
                color: "white",

                _hover: {
                    backgroundColor: "darkblue",
                },
            }}
            inlineStyle={{
                transform: `scale(${scale})`,
                opacity: opacity,
            }}
        >
            Scroll to scale & fade
        </varwolf.div>
    )
}
```

## 📚 API Reference

### Types

```tsx
import type { VarwolfStyles, VarwolfInlineStyles } from "varwolf"

// VarwolfStyles - for style prop (supports pseudo-classes & pseudo-elements)
interface ComponentProps {
    style?: VarwolfStyles
}

// VarwolfInlineStyles - for inlineStyle prop (no pseudo-classes/elements)
interface ComponentProps {
    inlineStyle?: VarwolfInlineStyles
}
```

### Supported Pseudo-Classes

All standard CSS pseudo-classes with camelCase autocomplete:

```plaintext
:active
:checked
:disabled
:enabled
:first-child
:focus-visible
:focus-within
:focus
:hover
:invalid
:last-child
:link
:placeholder-shown
:required
:valid
:visited
```

### Advanced Hook

```tsx
import { useVarwolf } from "varwolf"

function CustomComponent() {
    const { className } = useVarwolf({
        __bg: "red",

        backgroundColor: "var(--bg)",

        _hover: {
            __bg: "darkred",
        },

        $before: {
            content: "→",
        },
    })

    // Use with third-party components
    return <MuiButton className={className}>Custom</MuiButton>
}
```

## ⚡ Performance

### Development Mode

-   CSS injected via `textContent` for visibility in DevTools
-   Full debugging support

### Production Mode

-   CSS injected via `insertRule()` (3x faster)
-   Optimized for performance

### Caching & Optimization

-   Stable hashing prevents duplicate injections
-   Styles cached across component re-renders
-   **Lazy variable generation**: Only injects variables you use from groups
-   React StrictMode compatible

## 🔧 TypeScript

Full type safety with element-specific props:

```tsx
import { varwolf } from "varwolf"

// ✅ Valid - button-specific props
<varwolf.button disabled type="submit" />

// ✅ Valid - input-specific props
<varwolf.input placeholder="Email" type="email" />

// ✅ Valid - anchor-specific props
<varwolf.a href="https://example.com" target="_blank" />

// ❌ Error: Property 'disabled' does not exist on type 'a'
<varwolf.a disabled />
```

## 🤔 FAQ

### Why use Varwolf over styled-components/Emotion?

Varwolf focuses on **CSS variable manipulation**, not replacing CSS-in-JS libraries.

**Use Varwolf when:**

-   ✅ You want to dynamically control CSS variables
-   ✅ You need state-based variable changes
-   ✅ You're building with modern CSS custom properties
-   ✅ You need both static and dynamic styles

### Does it work with existing CSS?

Yes! Varwolf generates CSS custom properties that work with any CSS.

### What's the difference between `style` and `inlineStyle`?

-   **`style`**: Static styles + pseudo-classes + pseudo-elements → Injected into `<style>` tag
-   **`inlineStyle`**: Dynamic values → Applied as inline `style=""` attribute

Use `style` for most cases, `inlineStyle` for frequently changing values (animations, scroll, drag).

### Bundle size?

Varwolf is one of the smallest CSS-in-JS libraries available:

| Format         | Size      | Description                 |
| -------------- | --------- | --------------------------- |
| Package (.tgz) | 19.4 KB   | Includes TypeScript types   |
| Minified       | 8 KB      | Production JavaScript       |
| **Gzipped**    | **~2 KB** | **Actual download size** ✅ |

### Size Comparison

| Library           | Gzipped       |
| ----------------- | ------------- |
| styled-components | 15.2 KB       |
| Emotion           | 8.9 KB        |
| Stitches          | 5.8 KB        |
| vanilla-extract   | 4.2 KB        |
| **Varwolf**       | **1.8 KB** 🏆 |

Varwolf is **8x smaller** than styled-components and **5x smaller** than Emotion!

### Browser support?

All modern browsers supporting CSS custom properties:

-   Chrome 49+
-   Firefox 31+
-   Safari 9.1+
-   Edge 15+

## 📄 License

[MIT](LICENSE) © Kunal Tanwar

## 🙏 Contributing

Contributions Welcome! Please open an [issue](https://github.com/KunalTanwar/varwolf/issues) or [PR](https://github.com/KunalTanwar/varwolf/pulls) on [GitHub](https://github.com/KunalTanwar/varwolf).

## 🌟 Show Your Support

-   ⭐ [Star the Repo](https://github.com/KunalTanwar/varwolf)
-   🐦 Share on Social Media
-   📝 Write About It
-   🐛 Report Bugs
-   💡 Suggest Features

**Made with 🐺 by [Kunal Tanwar](https://github.com/KunalTanwar)**
