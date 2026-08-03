import type { ReactNode } from 'react'
import AnchorTOC from './AnchorTOC'
import type { TocItem } from './AnchorTOC'

interface ReadingLayoutProps {
  title: string
  lead?: string
  /** 元信息行，如「适用对象 · 最后更新」 */
  meta?: string
  toc: TocItem[]
  children: ReactNode
}

/**
 * 知识库阅读布局：
 * 左侧为标题 + 导读 + 正文的阅读列，右侧为吸顶锚点目录。
 */
export default function ReadingLayout({ title, lead, meta, toc, children }: ReadingLayoutProps) {
  return (
    <div className="flex items-start gap-10">
      <article className="min-w-0 flex-1">
        <header className="border-b border-slate-200 pb-5">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          {lead && <p className="mt-2 text-sm leading-7 text-slate-500">{lead}</p>}
          {meta && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">{meta}</div>
          )}
        </header>
        <div className="pt-6">{children}</div>
      </article>

      <aside className="sticky top-[80px] hidden w-56 shrink-0 lg:block">
        <AnchorTOC items={toc} />
      </aside>
    </div>
  )
}
