import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
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
        soft: "0 20px 60px rgba(255, 107, 154, 0.14)"
      }
    }
  },
  plugins: []
} satisfies Config;

