/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        xrpl: {
          dark: "#0B1120",
          blue: "#1E40AF",
          accent: "#3B82F6",
          light: "#93C5FD",
        },
      },
    },
  },
  plugins: [],
};
