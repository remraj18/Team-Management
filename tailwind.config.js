/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // Agar aap `app` folder ka use kar rahe hain to is path ko bhi add karein
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
