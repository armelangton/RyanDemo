import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#0B9049",
          greenDark: "#08733B",
          greenSoft: "#EAF6EF",
          orange: "#E95D2A",
          red: "#c41230",
          redDark: "#8f1024",
          charcoal: "#173B2D",
          black: "#173B2D",
          gray900: "#173B2D",
          gray700: "#334155",
          gray500: "#64748B",
          gray200: "#D6DEE3",
          gray100: "#f4f5f6",
          white: "#ffffff",
          success: "#0B9049",
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
