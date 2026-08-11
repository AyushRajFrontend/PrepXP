import { defineConfig }       from 'vite'
import react                  from '@vitejs/plugin-react'
import tailwindcss             from '@tailwindcss/vite'
import { fileURLToPath, URL }  from 'node:url'

/**
 * Vite 6 configuration for PrepXP
 *
 * - Tailwind CSS v4 via the official Vite plugin (no postcss.config needed)
 * - React 19 with the standard @vitejs/plugin-react
 * - Path alias: @ → src/
 * - Manual chunk splitting for optimal caching on Vercel
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    target:    'esnext',
    minify:    'esbuild',
    sourcemap: false,

    rollupOptions: {
      output: {
        /**
         * Split vendor code into separate cacheable chunks.
         * Small app payload + long-lived cache headers on Vercel.
         */
        manualChunks: {
          'vendor-react':  ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-charts': ['recharts'],
          'vendor-icons':  ['lucide-react'],
        },
      },
    },
  },

  /* Ensure dev server serves SPA correctly */
  server: {
    port: 5173,
    strictPort: false,
  },
})
