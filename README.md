# 🐺 Varwolf

A Modern, Lightweight Utility Library for React. **Built for Clarity, Performance and Developer sanity.**

## ⚠️ Important Notice

**Varwolf v2 is a complete rewrite from the ground up.**

-   Not Backward Compatible.
-   Internal Architecture Redesigned.
-   New build System and Tooling.
-   Cleaner, more Intentional Public API.

If you are looking for the stable `v1` release, use -

```bash
npm install varwolf

# or

npm install varwolf@^1.3.0
```

## 🚧 Status

Varwolf v2 - Rewrite in Progress.

This branch represents the future of Varwolf.

Expect breaking changes until the first stable `v2.0.0` release.

## What's New in `v2`?

-   ⚡ Bun for faster installs and builds.
-   🧱 Vite (library mode) for modern bundling.
-   🗂️ Cleaner folder structure following TypeScript best practices.
-   🧩 Schema-based pseudo-classes for maintainability.
-   🔁 Functional pseudo-classes (:has(), :not(), :is(), and more).
-   🧠 Improved TypeScript types & DX.
-   📦 Smaller, more predictable bundles.

## 📦 Installation (v2 - pre-release)

> ⚠️ Not published yet.

Once released -

```bash
npm install varwolf@^2.0.0
```

## Philosphy

Varwolf v2 is built with a few strong principles -

-   Explicit over magical
-   Small API surface over feature bloat
-   Tree-shakeable by default
-   Zero unnecessary runtime cost
-   Maintainable internals > clever hacks

If something feels "too magical", it probably doesn't belong here.

## 🗺️ Migration from `v1` -> `v2`

A migration guide will be provided once v2 reaches stability.

Until then -

-   v1.x remains fully supported
-   v2 development happens in parallel
-   No silent breaking changes

## 🛠️ Development

```bash
bun install
bun run dev
```

Build:

```bash
bun run build
```

## 📄 LICENSE

[MIT](https://github.com/KunalTanwar/varwolf/blob/main/LICENSE.md) © Kunal Tanwar
