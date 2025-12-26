/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#1d9b7f",
          600: "#15745f"
        }
      }
    }
  },
  plugins: []
};
