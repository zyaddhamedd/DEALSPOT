import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Product page light theme
        background: "#faf7f2",
        cream: "#faf7f2",
        creamDark: "#f2ede4",
        surface: "#ffffff",
        card: "#ffffff",
        line: "#e5e7eb",
        accent: "#e11d2f",
        accentSoft: "#fef2f2",
        // Admin dark (kept for backward compat)
        adminBg: "#050505",
        adminCard: "#111111",
      },
      fontFamily: {
        heading: ["Cairo", "Tajawal", "sans-serif"],
        body: ["Cairo", "Tajawal", "sans-serif"],
        sans: ["Cairo", "Tajawal", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
        "5xl": "28px",
      },
      boxShadow: {
        soft: "0 4px 24px rgba(0,0,0,0.07)",
        card: "0 8px 32px rgba(0,0,0,0.10)",
        glow: "0 8px 24px rgba(225, 29, 47, 0.32)",
      },
    },
  },
  plugins: [],
};

export default config;
