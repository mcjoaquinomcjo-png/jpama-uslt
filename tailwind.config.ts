import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#061325",
          900: "#0A2540", // USD Torero Navy
          800: "#0E355C",
          700: "#14487A",
          600: "#1F5E9E",
          100: "#EAF2FA",
          50: "#F4F8FC",
        },
        gold: {
          foil: "#C5A059", // Refined collegiate gold
          muted: "#9E824C",
          light: "#FBF7EF",
          hairline: "rgba(197, 160, 89, 0.25)",
          hover: "#B38F48",
          champagne: "#E8D8BA",
        },
        academic: {
          emerald: "#1B4D3E", // USLT Institutional Accent
          slate: "#334155",
        },
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Cinzel", "Playfair Display", "Georgia", "serif"],
        display: ["var(--font-cinzel)", "Cinzel", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        "clean-card": "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        "clean-card-hover": "0 10px 25px -5px rgba(10, 37, 64, 0.08), 0 8px 10px -6px rgba(10, 37, 64, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
