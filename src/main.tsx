import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// 使用 HashRouter：GitHub Pages 等静态托管不处理 SPA 深层路由，
// hash 路由（/#/xxx）可保证任意页面刷新/直达均能正确加载。
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
