import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary palette (Grays/Silvers)
        charcoal: "#2C3A47", // Deep Charcoal (slate-800 equivalent)
        graphite: "#57606f", // Graphite Gray (slate-600 equivalent)
        silver: "#A4B0BD", // Silver Stone (slate-400 equivalent)
        steel: "#E1E5EA", // Light Steel (slate-200 equivalent)
        offwhite: "#F5F7FA", // Off-White/Pale Silver (slate-50 equivalent)
        
        // Accent colors
        amber: {
          DEFAULT: "#FFBF00", // Primary Accent - vibrant amber
          dark: "#D4A017", // Secondary Accent/Hover - deeper gold
        },
        
        // Semantic colors
        success: "#63A375", // Success/Opportunity - muted teal/green
        warning: "#D97E6A", // Warning/Crisis - muted warm orange/red
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05)',
        'interactive': '0 6px 16px rgba(0, 0, 0, 0.1), 0 3px 8px rgba(0, 0, 0, 0.07)',
        'input': 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        'focus': '0 0 0 3px rgba(255, 191, 0, 0.3)',
      },
      transitionProperty: {
        'default': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
      },
      transitionDuration: {
        'default': '200ms',
      },
      transitionTimingFunction: {
        'default': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
