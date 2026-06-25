import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#1f6b3a",
          greenDark: "#164f2b",
          red: "#c41230",
          redDark: "#8f1024",
          charcoal: "#1f3428",
          black: "#111315",
          gray900: "#2d3237",
          gray700: "#5f666d",
          gray500: "#8c939a",
          gray200: "#e7e9eb",
          gray100: "#f4f5f6",
          white: "#ffffff",
          success: "#2f6f4e",
          warning: "#a86612",
        },
      },
      boxShadow: {
        panel: "0 18px 38px rgba(17, 19, 21, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
