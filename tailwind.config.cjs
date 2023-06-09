const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  // mode: "jit",
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // 'kusogaki-purple': '#6167c5',
        // 'kusogaki-blue': '#91a8dd',
        // 'kusogaki-red': '#eba3b4',
        // 'kusogaki-yellow': '#f5e9a4',
        // 'kusogaki-blue': '#91a8dd',
        // 'kusogaki-cyan': '#8ad3e0',
        // 'kusogaki-green': '#ade9db'
      }
    }
  },
  plugins: []
}
