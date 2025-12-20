import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    babel: {
      plugins: []
    }
  })],
  server: {
    fs: {
      strict: false
    },
    hmr: {
      overlay: false
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    force: true
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        admin: './admin.html'
      }
    }
  }
})
