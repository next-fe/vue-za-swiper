import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: [ '..' ]
    }
  },
  resolve: {
    alias: {
      'common': path.resolve(__dirname, '../common'),
      'lodash-es': path.resolve(__dirname, './node_modules/lodash-es')
    },
  },
  build: {
    rollupOptions: {
      // 请确保外部化那些你的库中不需要的依赖
      external: [ 'vue' ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
    lib: {
      entry: '../common/za-swiper/index.js',
      fileName: 'index',
      name: 'z-index',
    },
  },
})
