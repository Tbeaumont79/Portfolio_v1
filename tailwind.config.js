/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#E91E63",
        accent: "#00BCD4",
        lighttext: "#B0BEC5",
      },
      background: {
        primary: "#121212",
        secondary: "#6A1B9A",
      },
    },
  },
  plugins: [],
};
