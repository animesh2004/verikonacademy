import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        muted: "var(--muted)",
        "muted-strong": "var(--muted-strong)",
        subtle: "var(--subtle)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        accent: "var(--accent)",
        "accent-strong": "var(--accent-strong)",
        "accent-2": "var(--accent-2)",
      },
      fontSize: {
        display: ["var(--text-display)", { lineHeight: "0.95", letterSpacing: "-0.045em" }],
        h1: ["var(--text-5xl)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        h2: ["var(--text-4xl)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        h3: ["var(--text-3xl)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.22, 1, 0.36, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        250: "250ms",
      },
    },
  },
  plugins: [],
};

export default config;
