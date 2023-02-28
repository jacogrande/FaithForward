/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ffBlue: "#5eb5d1",
        ffLightBlue: "#e6f5fa",
        ffRed: "#ed6c61",
        ffSand: "#DAC78E",
        ffOrange: "#f08c7d",
        ffPaper: "#fefdf9",
        ffLightPaper: "rgba(255, 255, 255, 0.7)",
        ffDarkPaper: "rgba(0, 0, 0, 0.05)",
        ffBlack: "#222",
      }
    },
  },
  plugins: [],
};
