import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'


console.log('111111111')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createVuePlugin(),
  ],
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
