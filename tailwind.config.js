/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D0D78",
        accent: "#4FE5CE",
        teal: "#00A9A4",
        tealHover: "#009691",
        slate: {
          50: "#f5f5f5",
          100: "#eeeeee",
          200: "#e4e5e7",
        },
        gray: {
          500: "#808285",
        },
      },
      fontFamily: {
        helveticaMedium: ["HelveticaNowDisplay-Medium", "sans-serif"],
        helveticaBold: ["HelveticaNowDisplay-Bold", "sans-serif"],
        textRegular: ["HelveticaNowText-Regular", "sans-serif"],
        textMedium: ["HelveticaNowText-Medium", "sans-serif"],
        textBold: ["HelveticaNowText-Bold", "sans-serif"],
        textExtraBold: ["HelveticaNowText-ExtraBold", "sans-serif"],
        rubikLight: ["Rubik-Light", "sans-serif"],
      },
      borderRadius: {
        xl: "24px",
        "2xl": "32px",
      },
      boxShadow: {
        card: "0 20px 50px rgba(13, 13, 120, 0.08)",
      },
    },
  },
  plugins: [],
};
