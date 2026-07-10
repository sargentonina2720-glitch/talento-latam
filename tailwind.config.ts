import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        slate: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        success: { 50: "#f0fdf4", 600: "#16a34a" },
        warn:    { 50: "#fffbeb", 600: "#d97706" },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body:    ["'Inter'", "sans-serif"],
      },
      borderRadius: { xl: "12px", "2xl": "16px" },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.10)",
      },
    },
  },
  plugins: [],
};
export default config;
