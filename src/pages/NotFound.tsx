import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-4xl font-bold text-slate-300">404</div>
      <p className="mt-3 text-sm text-slate-500">抱歉，您访问的页面不存在或已被移动。</p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
      >
        返回首页
      </Link>
    </div>
  )
}
