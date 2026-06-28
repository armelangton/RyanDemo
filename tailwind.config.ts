import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#009444",
          greenDark: "#123c2a",
          greenSoft: "#eef8f2",
          orange: "#e45f2b",
          red: "#c41230",
          redDark: "#8f1024",
          charcoal: "#163b2d",
          black: "#163b2d",
          gray900: "#163b2d",
          gray700: "#4b5563",
          gray500: "#6b7280",
          gray200: "#d9dee3",
          gray100: "#f4f5f6",
          white: "#ffffff",
          success: "#009444",
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
