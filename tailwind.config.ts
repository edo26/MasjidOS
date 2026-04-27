import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "marquee-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "marquee-x": "marquee-x linear infinite",
      },
      boxShadow: {
        neo: "4px 4px 0 0 #000",
        "neo-sm": "2px 2px 0 0 #000",
        "neo-lg": "6px 6px 0 0 #000",
        "neo-inset": "inset 2px 2px 0 0 #000",
      },
    },
  },
  plugins: [],
};

export default config;
