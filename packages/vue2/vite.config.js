import path from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  },
  plugins: [
    createVuePlugin(),
  ],
  resolve: {
    alias: {
      'common': path.resolve(__dirname, '../common'),
      'lodash-es': path.resolve(__dirname, './node_modules/lodash-es'),
      // 测试用
      // '@za/vue-za-swiper': path.resolve(__dirname, './node_modules/@za/vue-za-swiper')
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
      name: 'index',
    },
  },
})
