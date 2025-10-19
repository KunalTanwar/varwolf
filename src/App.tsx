import { useState } from "react"

import { varwolf } from "@/lib"

function App() {
    const [scale, setScale] = useState(1)

    return (
        <varwolf.div
            style={{
                __bg: "red",
                __size: "100px",

                color: "white",
                aspectRatio: 1 / 1,
                width: "var(--size)",
                height: "var(--size)",
                backgroundColor: "var(--bg)",

                _hover: {
                    __bg: "blue",
                    __size: (cv) => `calc(${cv} * 1.5)`,
                },

                _active: {
                    __size: (cv) => `calc(${cv} * 0.5)`,
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
