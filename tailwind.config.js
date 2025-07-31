// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    colors: {
      accent: "#FBBF24",
      neutral: "#374151",
      white: "#FFFFFF",
      info: "#3ABFF8",
      success: "#36D399",
      warning: "#FBBD23",
      error: "#F87272",

      // Custom colors
      foreground: "#000",
      primary: "#ff5a3c",
      "primary-dark": "#df4124",
      "foreground-muted-dark": "#dbdad8",
      "foreground-muted": "#4b5563",
      background: "#ecede9",
      "background-dark": "#171717",
      card: "#f9f9f7",
      "card-dark": "#252525",
      border: "#686867",
      destructive: "#f13b58",
    },
  },
  plugins: [],
};
