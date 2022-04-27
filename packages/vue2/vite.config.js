import path from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
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
      'lodash-es': path.resolve(__dirname, './node_modules/lodash-es')
    },
  },
  build: {
    // outDir: '../dist/vue2',
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
      entry: '../packages/index.js',
      fileName: 'z-vue-swiper',
      name: 'z-vue-swiper',
    },
  },
})