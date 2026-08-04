import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 部署路径（base）：
// - 本地开发 / 预览：根路径 '/'
// - GitHub Pages 部署：已绑定自定义域名 https://guide.hufe.tech，资源从域名根目录加载，
//   因此 base 固定为 '/'。保留 BASE_PATH 环境变量回退仅作本地调试备用，工作流不再注入。
const base = process.env.BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base,
  server: {
    port: 5173,
  },
})
