import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

import cesium from 'vite-plugin-cesium';

export default defineConfig({
  plugins: [vue(), cesium()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // ====== 需要添加的代理配置 ======
  server: {
    proxy: {
      // 当请求路径以 '/api' 开头时
      '/api': {
        target: 'http://127.0.0.1:5000', // 转发到你的后端 API 地址
        changeOrigin: true, // 改变请求头中的 Origin 字段
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径：移除 '/api' 前缀，所以 '/api/ask' 会被转发为 'http://127.0.0.1:5000/ask'
      }
    }
  }
  // ==============================
})