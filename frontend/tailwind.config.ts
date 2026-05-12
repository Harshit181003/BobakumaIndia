import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"]
      },
      colors: {
        brand: {
          navy: "#1e2a4a",
          "navy-deep": "#141d33",
          gold: "#b8954a",
          "gold-light": "#d4bc7a",
          /** Opal / sage — works on light + dark */
          sage: "#5f8578",
          sand: "#f0ebe4",
          mist: "#e4ebe8",
          opal: {
            50: "#f4faf8",
            100: "#e3f0ec",
            800: "#1e2e2b",
            900: "#141f1d"
          }
        },
        cream: {
          50: "#FFFDF8",
          100: "#FFF7E8"
        },
        blush: {
          50: "#FFF5F7",
          100: "#FFE6EC",
          500: "#FF6B9A"
        },
        peach: {
          50: "#FFF7F0",
          100: "#FFE9D6",
          500: "#FF8A5B"
        },
        lavender: {
          50: "#F8F6FF",
          100: "#EEE9FF",
          500: "#8A7DFF"
        },
        mint: {
          50: "#F0FDF7",
          100: "#D4F5E5",
          500: "#3CB88A"
        },
        ink: {
          900: "#1B1B1F"
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(61, 184, 138, 0.12)"
      }
    }
  },
  plugins: []
} satisfies Config;

