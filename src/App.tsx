import { useState } from "react"

import { varwolf } from "@/lib"

function App() {
    const [scale, setScale] = useState(1)

    return (
        <varwolf.div
            style={{
                __bg: "red",
                __size: "100px",

                __spacing: {
                    sm: "10px",
                    md: "20px",
                    lg: "30px",
                },

                color: "white",
                display: "flex",
                aspectRatio: 1 / 1,
                width: "var(--size)",
                alignItems: "center",
                height: "var(--size)",
                justifyContent: "center",
                padding: "var(--spacing-lg)",
                backgroundColor: "var(--bg)",

                _hover: {
                    __bg: "blue",
                    __size: (cv) => `calc(${cv} * 1.5)`,
                },

                _active: {
                    __size: (cv) => `calc(${cv} * 0.5)`,
                },

                $after: {
                    __size: "1rem",

                    __spacing: {
                        sm: "5px",
                    },

                    content: "",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "var(--size)",
                    height: "var(--size)",
                    translate: "50% -50%",
                    borderRadius: "100vmax",
                    padding: "var(--spacing-lg)",
                    backgroundColor: "limegreen",
                },
            }}
            inlineStyle={{
                transform: `scale(${scale})`, // Use `inlineStyle` for dynamic JS values
            }}
            onClick={() => setScale(scale + 0.1)}
        >
            Hello, World!
        </varwolf.div>
    )
}

export default App
