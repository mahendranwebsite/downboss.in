import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        twitter: "#1DA1F2",
        instagram: "#E1306C",
        facebook: "#1877F2",
        tiktok: "#00F2FE",
        youtube: "#FF0000",
        pinterest: "#BD081C",
        linkedin: "#0A66C2",
        reddit: "#FF4500",
        snapchat: "#FFFC00",
        darkBg: "#0B0F17",
        darkCard: "#151C28",
        darkHover: "#1E293B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
