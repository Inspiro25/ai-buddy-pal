
import { type Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        // Gemini theme specific colors
        gemini: {
          teal: {
            DEFAULT: "#14B8A6",
            light: "#5EEAD4",
            dark: "#0F766E",
          },
          blue: {
            DEFAULT: "#0EA5E9",
            light: "#67E8F9",
            dark: "#0369A1",
          },
          gray: {
            dark: "#1A1F2C",
            light: "#E2E8F0",
          }
        }
      },
      padding: {
        'safe': 'env(safe-area-inset-bottom)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      screens: {
        'xs': '390px',
      },
      animation: {
        'gradient-x': 'gradient-x 10s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
      boxShadow: {
        'gemini': '0 4px 20px -5px rgba(20, 184, 166, 0.3)',
      },
    }
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};

export default config;
