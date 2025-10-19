import { defineConfig } from "vite"

import tsconfigPaths from "vite-tsconfig-paths"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"

import { resolve } from "path"

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        react(),
        dts({
            include: ["src/lib/**/*.ts", "src/lib/**/*.tsx"],
            exclude: [
                "**/*.test.ts",
                "**/*.test.tsx",
                "**/*.spec.ts",
                "**/*.spec.tsx",
                "node_modules/**",
                "src/main.tsx",
                "src/App.tsx",
            ],
            outDir: "dist",
            rollupTypes: false,
            insertTypesEntry: true,
            tsconfigPath: "./tsconfig.app.json",
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, "src/lib/index.ts"),
            name: "Varwolf",
            formats: ["es", "cjs"],
            fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`,
        },
        rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                    "react/jsx-runtime": "jsxRuntime",
                },
            },
        },
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: true,
        minify: true,
    },
    define: {
        "process.env.NODE_ENV": JSON.stringify("production"),
    },
})
