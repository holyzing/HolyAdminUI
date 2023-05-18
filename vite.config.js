import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

import vueJsx from "@vitejs/plugin-vue-jsx";
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueSetupExtend(),
    createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg/')],
        symbolId: 'icon-[dir]-[name]',
    }),
  ],
  server: {
    host: '0.0.0.0'
  },
  define: {
    // 共享配置 https://cn.vitejs.dev/config/shared-options.html#define
    'process.env': {
      VITE_APP_BASE_API: "http://10.240.2.127:8000"
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    //   replacement: fileURLToPath(
    //     new URL('./src/components/$1/index.vue', import.meta.url)
    //   )
      // / '~': fileURLToPath(new URL('./node_modules', import.meta.url))
    }
  },
  css: {
    modules: {

    },
    // vite-svg-loader
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true
      }
    }
  }
})
// cd ~/Xtalpi/Golang/GoAdmin/go-admin && ./go-admin server -c config/settings.sqlite.yml