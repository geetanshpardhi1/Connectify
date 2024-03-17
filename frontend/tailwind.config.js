/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "circle_landing_1": "url('./src/assets/left bg landing.png')",
        "circle_landing_2": "url('./src/assets/right-bg-langing.png)"
      },
    },
  },
  plugins: [],
};
