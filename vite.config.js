import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    //   replacement: fileURLToPath(
    //     new URL('./src/components/$1/index.vue', import.meta.url)
    //   )
      // / '~': fileURLToPath(new URL('./node_modules', import.meta.url))
    }
  }
})
