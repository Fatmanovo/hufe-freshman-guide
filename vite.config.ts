import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages 部署路径（base）：
// - 本地开发 / 预览：默认根路径 '/'
// - GitHub Pages 部署：由 .github/workflows/deploy.yml 通过 BASE_PATH 环境变量注入，
//   值为 /<仓库名>/（如 /freshman-guide/），从而保证 JS/CSS/图片资源路径正确。
const base = process.env.BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base,
  server: {
    port: 5173,
  },
})
