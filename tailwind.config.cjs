/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
  darkMode: "class", // allows toggling dark mode manually
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif", ...defaultTheme.fontFamily.sans],
        serif: ["Source Serif 4", "Noto Serif SC", "Songti SC", "STSong", "Georgia", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
