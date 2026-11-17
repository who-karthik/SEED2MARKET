import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#153D2C",
          50: "#f0f6f2",
          100: "#dbeade",
          200: "#b8d5be",
          300: "#8bbb98",
          400: "#5c9c6f",
          500: "#3d7e51",
          600: "#2d633e",
          700: "#244e33",
          800: "#1d3e2a",
          900: "#153D2C",
          950: "#0b2016",
        },
        primaryGreen: {
          DEFAULT: "#247A48",
          hover: "#1D643B",
          light: "#EAF5EE",
        },
        leafGreen: {
          DEFAULT: "#76A95C",
          hover: "#63924C",
          light: "#F0F7EC",
        },
        warmCream: "#F7F5EA",
        lightBeige: "#E8DFC8",
        earthBrown: {
          DEFAULT: "#92724F",
          light: "#C5B29B",
          dark: "#5A442E",
        },
        darkText: "#202B24",
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
