import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Globe, Mail, X } from 'lucide-react'
import { menu } from '../data/menu'
import type { MenuItem } from '../data/menu'

/** 判断菜单项（含子菜单）是否处于激活路径 */
function isActive(item: MenuItem, pathname: string): boolean {
  if (item.path === pathname) return true
  if (item.children) return item.children.some((child) => isActive(child, pathname))
  return false
}

/** 查找某路径所属的直接父级分组 */
function parentOf(items: MenuItem[], pathname: string): MenuItem | null {
  for (const item of items) {
    if (item.children) {
      if (item.children.some((child) => child.path === pathname)) return item
      const nested = parentOf(item.children, pathname)
      if (nested) return nested
    }
  }
  return null
}

interface SidebarProps {
  /** 移动端抽屉是否打开 */
  open: boolean
  /** 关闭抽屉 */
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { pathname } = useLocation()
  const [expanded, setExpanded] = useState<string[]>(() => {
    const parent = parentOf(menu, pathname)
    return parent ? [parent.title] : []
  })

  // 路由变化时，自动展开当前页面所属分组
  useEffect(() => {
    const parent = parentOf(menu, pathname)
    if (parent) {
      setExpanded((prev) => (prev.includes(parent.title) ? prev : [...prev, parent.title]))
    }
  }, [pathname])

  const toggle = (title: string) => {
    setExpanded((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    )
  }

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-[#eeeeee] bg-white transition-transform duration-200 ${
        open ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      {/* Logo 区 */}
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[#eeeeee] pl-5 pr-2">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="logo.jpg"
            alt="湖南财政经济学院"
            className="h-9 w-auto shrink-0 object-contain"
          />
          <div className="min-w-0 truncate text-base font-semibold text-slate-800">
            湖南财政经济学院
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭导航菜单"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {menu.map((item) => {
            if (item.children) {
              const isOpen = expanded.includes(item.title)
              const groupActive = isActive(item, pathname)
              return (
                <li key={item.title}>
                  <button
                    type="button"
                    onClick={() => toggle(item.title)}
                    className={`flex h-10 w-full items-center justify-between rounded-lg px-3 text-sm transition-colors ${
                      groupActive
                        ? 'bg-blue-50 font-medium text-blue-600'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {item.icon && <item.icon size={18} />}
                      {item.title}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <ul className="mt-1 space-y-1 pb-1">
                      {item.children.map((child) => {
                        const active = child.path === pathname
                        return (
                          <li key={child.path}>
                            <Link
                              to={child.path!}
                              onClick={onClose}
                              className={`flex h-9 items-center rounded-md pl-10 pr-3 text-sm transition-colors ${
                                active
                                  ? 'bg-blue-600 font-medium text-white'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                              }`}
                            >
                              {child.title}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            }

            // 外部链接（如学校官网），新标签页打开
            if (item.href) {
              return (
                <li key={item.title}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex h-10 items-center gap-2.5 rounded-lg px-3 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600"
                  >
                    {item.icon && <item.icon size={18} />}
                    {item.title}
                  </a>
                </li>
              )
            }

            const active = item.path === pathname
            return (
              <li key={item.path}>
                <Link
                  to={item.path!}
                  onClick={onClose}
                  className={`flex h-10 items-center gap-2.5 rounded-lg px-3 text-sm transition-colors ${
                    active
                      ? 'bg-blue-600 font-medium text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.icon && <item.icon size={18} />}
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-[#eeeeee] px-5 py-3 text-xs text-slate-400">
        <div>新生 · 入学须知</div>
        <a
          href="mailto:sk060@foxmail.com"
          className="mt-1 flex items-center gap-1.5 transition-colors hover:text-blue-600"
        >
          <Mail size={12} />
          sk060@foxmail.com
        </a>
        <a
          href="https://www.hufe.edu.cn/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex items-center gap-1.5 transition-colors hover:text-blue-600"
        >
          <Globe size={12} />
          学校官网
        </a>
      </div>
    </aside>
  )
}
