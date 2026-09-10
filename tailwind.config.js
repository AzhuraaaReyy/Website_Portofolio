/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blueprint: {
          bg: "#0B1220",       // Navy sangat gelap
          bgSec: "#132238",    // Navy sekunder (cards/sections)
          teal: "#5EEAD4",     // Teal cerah (primary accent)
          amber: "#F5B754",    // Amber hangat (secondary accent)
          text: "#E8ECF1",     // Putih kebiruan (text primary)
          textSec: "#8A93A6",  // Abu kebiruan (text secondary)
          line: "rgba(94, 234, 212, 0.08)", // Blueprint grid line color
        }
      },
      fontFamily: {
        // Font teks standar diganti ke font ala sci-fi/terminal game
        sans: ["'Rajdhani'", "'Inter'", "sans-serif"],
        // Font judul/header bergaya HUD cyberpunk & arcade
        display: ["'Chakra Petch'", "'Orbitron'", "sans-serif"],
        // Font terminal/code HUD bertema gaming
        mono: ["'Share Tech Mono'", "'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        'blueprint-grid': 'linear-gradient(to right, rgba(94, 234, 212, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(94, 234, 212, 0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-size': '40px 40px',
      }
    },
  },
  plugins: [],
}