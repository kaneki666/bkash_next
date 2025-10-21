/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F9FAFB",
        surface: "#FFFFFF",
        divider: "#E5E7EB",
        "text-primary": "#000000",
        "text-secondary": "#4B5563",
        "text-disabled": "#9CA3AF",
        "text-inverse": "#FFFFFF",
        primary: "#E90159",
        "primary-hover": "#D0014F",
        "primary-light": "#FCE8EF",
        "disabled-fill": "#F3F4F6",
        "secondary-action": "#97001D",
        "secondary-action-dark": "#6b0014",
        "secondary-hover": "#FCE8EF",
        success: "#01846C",
        "success-light": "#E6F3F0",
        warning: "#FF8C00",
        "warning-dark": "#b36200",
        "warning-light": "#FFF4E6",
        info: "#0A50A1",
        error: "#D50033",
      },
    },
  },
  plugins: [],
};
