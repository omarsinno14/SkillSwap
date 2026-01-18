import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6D28D9",
          foreground: "#FFFFFF"
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
