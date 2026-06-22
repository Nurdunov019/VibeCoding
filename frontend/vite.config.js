import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          leaflet: ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
  server: {
    port: 3002,
    strictPort: false,
    proxy: {
      '/api': 'http://localhost:8002',
      '/uploads': 'http://localhost:8002',
    },
  },
})
