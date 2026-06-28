import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#009444",
          greenDark: "#16804a",
          greenSoft: "#eef8f2",
          orange: "#e45f2b",
          red: "#c41230",
          redDark: "#8f1024",
          charcoal: "#24513c",
          black: "#24513c",
          gray900: "#24513c",
          gray700: "#5f6873",
          gray500: "#747d88",
          gray200: "#d8dee4",
          gray100: "#f4f6f7",
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
