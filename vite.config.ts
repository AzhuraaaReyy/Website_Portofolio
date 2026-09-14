import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.glb"],
  build: {
    chunkSizeWarningLimit: 1400,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom|react-is|react-jsx-runtime|scheduler)/,
              priority: 30,
            },
            {
              name: 'gsap-vendor',
              test: /node_modules[\\/]gsap/,
              priority: 15,
            },
            {
              name: 'animation-vendor',
              test: /node_modules[\\/]framer-motion/,
              priority: 14,
            },
            {
              name: 'icons-vendor',
              test: /node_modules[\\/](react-icons|lucide-react|@phosphor-icons)/,
              priority: 12,
            },
          ],
        },
      },
    },
  },
})