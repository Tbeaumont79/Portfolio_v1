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
        darkBackground: "#000000",
        lightDarkBackground: "#00171f",
        purpleBackground: "#6A1B9A",
        softPink: "#ffcfef",
      },
      background: {},
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

      blur: {
        "4xl": "100px",
        "5xl": "150px",
      },
    },
  },
  plugins: [],
};
