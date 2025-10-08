/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // **THEME SINGLE POINT (Theming file)**
      colors: {
      // BACKGROUNDS & TEXT
        'primary-bg': '#F9FAFB', // Light Background
        'secondary-bg': '#1F2937', // Dark Background (e.g., footer)
        'primary-txt': '#111827', // Main Text
        'secondary-txt': '#6B7280', // Helper Text
        'error-color': '#EF4444', // Error/Alerts

        // BRAND COLORS
        'primary-brand': '#A0522D', // Main CTA / Accent (Sienna/Wood)
        'secondary-brand': '#E0AF3A', // Secondary Accent (Gold/Brass)
      },
      textColor: {
        'primary-heading': '#111827',
        'secondary-heading': '#A0522D',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
  ],
}
