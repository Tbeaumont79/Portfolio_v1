/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
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
      fontSize: {
        sm: "0.8rem",
        base: "1rem",
        xl: "1.066rem",
        "2xl": "1.421rem",
        "3xl": "1.894rem",
        "4xl": "2.525rem",
        "5xl": "3.366rem",
      },
      fontFamily: {
        roboto: ["Roboto", ...defaultTheme.fontFamily.sans],
        poppins: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
