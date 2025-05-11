// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    colors: {
      primary: "#3B82F6",
      secondary: "#9333EA",
      accent: "#FBBF24",
      neutral: "#374151",
      white: "#FFFFFF",
      foreground: "#000",
      info: "#3ABFF8",
      success: "#36D399",
      warning: "#FBBD23",
      error: "#F87272",
    },
  },
  plugins: [],
};
