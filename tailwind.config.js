// Keep opacity utilities (bg-primary/10, border-error/20, etc.) theme-aware.
const token = (name) => ({ opacityValue }) =>
  opacityValue === undefined
    ? `var(--${name})`
    : `color-mix(in srgb, var(--${name}) calc(${opacityValue} * 100%), transparent)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#E8F3F0",
          100: "#C5E1DA",
          200: "#9CCDBF",
          300: "#6FB4A0",
          400: "#3F8A77",
          500: "#2A7D6B",
          600: "#1F6F5F",
          700: "#18594C",
          800: "#134639",
          900: "#0D3329",
        },
        background: token("background"),
        surface: token("surface"),
        "surface-2": token("surface-2"),
        overlay: token("overlay"),
        accent: token("accent"),
        foreground: token("foreground"),
        "muted-foreground": token("muted-foreground"),
        border: token("border"),
        primary: {
          DEFAULT: token("primary"),
          hover: token("primary-hover"),
          foreground: token("primary-foreground"),
        },
        success: token("success"),
        error: token("error"),
        "ring-soft": "var(--ring-soft)",
        glow: "var(--glow)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        h1: ["36px", { lineHeight: "44px", fontWeight: "700" }],
        h2: ["28px", { lineHeight: "36px", fontWeight: "700" }],
        h3: ["22px", { lineHeight: "30px", fontWeight: "600" }],
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        small: ["14px", { lineHeight: "20px", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      borderRadius: {
        input: "12px",
        card: "24px",
        button: "14px",
      },
      boxShadow: {
        sm: "0 2px 8px rgba(0,0,0,.06)",
        md: "0 8px 24px rgba(0,0,0,.08)",
        lg: "0 20px 60px rgba(0,0,0,.12)",
        glow: "0 0 0 1px var(--ring-soft), 0 18px 50px -18px var(--glow)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease-out",
      },
    },
  },
  plugins: [],
};
