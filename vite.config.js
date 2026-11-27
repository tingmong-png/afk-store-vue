import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/.netlify/functions': {
        target: 'https://afk-store-8udv.netlify.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})