/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        xrpl: {
          dark: "#050508",
          surface: "#0c0c12",
          "surface-elevated": "#12121a",
          blue: "#1e3a5f",
          accent: "#22d3ee",
          "accent-muted": "#0891b2",
          light: "#a5f3fc",
          purple: "#a78bfa",
          violet: "#7c3aed",
        },
      },
      keyframes: {
        "gradient-orb-1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.05)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
        "gradient-orb-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-40px, 30px) scale(0.98)" },
          "66%": { transform: "translate(25px, -25px) scale(1.02)" },
        },
        "gradient-orb-3": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-15px, -30px) scale(1.03)" },
        },
      },
      animation: {
        "orb-1": "gradient-orb-1 25s ease-in-out infinite",
        "orb-2": "gradient-orb-2 30s ease-in-out infinite",
        "orb-3": "gradient-orb-3 22s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
