import { useEffect, useState } from 'react'

export interface TocItem {
  id: string
  /** 章节编号，如 1、1.2 */
  number: string
  title: string
  /** 层级深度，1 为章节、2 为小节 */
  level: number
}

interface AnchorTOCProps {
  items: TocItem[]
}

/** 吸顶头部高度 + 正文上边距，用于判定当前阅读位置 */
const HEADING_OFFSET = 96

/**
 * 右侧锚点目录：
 * 点击平滑滚动到对应章节；滚动时高亮当前所在章节。
 */
export default function AnchorTOC({ items }: AnchorTOCProps) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '')

  useEffect(() => {
    const update = () => {
      let current = items[0]?.id ?? ''
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= HEADING_OFFSET) current = item.id
      }
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [items])

  if (items.length === 0) return null

  return (
    <nav aria-label="本页目录" className="w-full">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        本页目录
      </div>
      <ul className="space-y-0.5 border-l border-slate-200">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                // HashRouter 下不能用 #锚点（会破坏路由），改为程序化平滑滚动
                e.preventDefault()
                setActive(item.id)
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`-ml-px flex items-baseline gap-1.5 border-l py-1 text-[13px] leading-5 transition-colors ${
                item.level === 2 ? 'pl-6' : 'pl-3'
              } ${
                active === item.id
                  ? 'border-blue-600 font-medium text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="shrink-0 tabular-nums">{item.number}</span>
              <span className="min-w-0">{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
