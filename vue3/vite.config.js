import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      'common': path.resolve(__dirname, '../common'),
      'z-swiper': path.resolve(__dirname, '../packages/index.js'),
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
      entry: './packages/index.js',
      fileName: 'z-swiper',
      name: 'z-swiper',
    },
  },
})
