import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/products': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/categories': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/customers': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/receipts': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  }
})