import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Search } from 'lucide-react'
import { menu } from '../data/menu'
import type { MenuItem } from '../data/menu'

/** 根据当前路径在菜单树中查找面包屑链路 */
function findTrail(items: MenuItem[], pathname: string): MenuItem[] {
  for (const item of items) {
    if (item.path === pathname) return [item]
    if (item.children) {
      const sub = findTrail(item.children, pathname)
      if (sub.length > 0) return [item, ...sub]
    }
  }
  return []
}

/** 拍平菜单树，用于搜索 */
function flatten(items: MenuItem[]): MenuItem[] {
  return items.flatMap((item) => (item.children ? [item, ...flatten(item.children)] : [item]))
}

/** 个别页面的标题覆盖（与菜单名称略有差异时使用） */
const PAGE_TITLES: Record<string, string> = {
  '/registration': '报到指南',
}

interface HeaderProps {
  /** 移动端打开导航抽屉 */
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const trail = useMemo(() => findTrail(menu, pathname), [pathname])
  const breadcrumb =
    pathname === '/' ? ['首页'] : ['首页', ...trail.map((item) => item.title)]
  const pageTitle = PAGE_TITLES[pathname] ?? trail[trail.length - 1]?.title ?? '新生指南'

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return []
    return flatten(menu)
      .filter((item) => item.path && item.title.toLowerCase().includes(keyword))
      .map((item) => ({ title: item.title, path: item.path! }))
  }, [query])

  const go = (path: string) => {
    navigate(path)
    setQuery('')
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[#eeeeee] bg-white px-4 sm:px-8">
      {/* 移动端菜单按钮 */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="打开导航菜单"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* 面包屑 + 页面标题 */}
      <div className="min-w-0 flex-1">
        <div className="hidden truncate text-xs text-slate-400 sm:block">
          当前位置：{breadcrumb.join(' / ')}
        </div>
        <h1 className="truncate text-lg font-semibold text-slate-800">{pageTitle}</h1>
      </div>

      {/* 搜索框 */}
      <div className="relative shrink-0">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results.length > 0) go(results[0].path)
          }}
          placeholder="请输入搜索内容"
          className="h-9 w-36 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10 sm:w-56 lg:w-64"
        />
        {open && results.length > 0 && (
          <ul className="absolute right-0 top-11 z-50 max-h-64 w-56 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-sm sm:w-64">
            {results.map((item) => (
              <li key={item.path}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(item.path)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                >
                  <span>{item.title}</span>
                  <span className="text-xs text-slate-400">{item.path}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  )
}
