const flowbite = require("flowbite-react/tailwind");

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
      'purple': {
        DEFAULT: '#872b97'
      },
      'pink': {
        DEFAULT: '#ff3c68'
      },
      'orange': {
        DEFAULT: '#ff7130'
      },
      'darkgray': {
        DEFAULT: '#171721'
      }
    }
  },
  plugins: [
    flowbite.plugin(),
  ],
}