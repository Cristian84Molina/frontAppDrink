/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        fredericka: ["Fredericka the Great", "cursive"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};