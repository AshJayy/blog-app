const flowbite = require("flowbite-react/tailwind");
import tailwindScrollbar from "tailwind-scrollbar";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {},
    colors: {
      'hl-purple': {
        DEFAULT: '#872b97'
      },
      'hl-pink': {
        DEFAULT: '#ff3c68'
      },
      'hl-orange': {
        DEFAULT: '#ff7130'
      },
      'bg-darkgray': {
        DEFAULT: '#171721'
      }
    }
  },
  plugins: [
    flowbite.plugin(),
    tailwindScrollbar,
  ],
}