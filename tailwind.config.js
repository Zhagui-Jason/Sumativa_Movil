/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F0F1FF",
          100: "#E3E5FF",
          500: "#686DDB",
          600: "#555BCC",
          700: "#454AAF",
        },
      },
    },
  },
  plugins: [],
};
