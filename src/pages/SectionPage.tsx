import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import type { TocItem } from '../components/AnchorTOC'
import ReadingLayout from '../components/ReadingLayout'
import { pageContents } from '../data/pages'
import type { DocSection } from '../data/pages'
import NotFound from './NotFound'

/** 递归收集目录项，章节编号由层级自动生成（1、1.1、1.1.1…） */
function collect(sections: DocSection[], numbers: number[], out: TocItem[]): TocItem[] {
  sections.forEach((section, index) => {
    const path = [...numbers, index + 1]
    out.push({
      id: `sec-${path.join('-')}`,
      number: path.join('.'),
      title: section.heading,
      level: path.length,
    })
    if (section.children) collect(section.children, path, out)
  })
  return out
}

/** 将列表文本中的邮箱地址渲染为 mailto 链接 */
function withLink(item: string): ReactNode {
  const match = item.match(/([\w.+-]+@[\w-]+\.[\w.]+)/)
  if (!match || match.index === undefined) return item
  const email = match[0]
  return (
    <>
      {item.slice(0, match.index)}
      <a
        href={`mailto:${email}`}
        className="text-blue-600 underline-offset-2 hover:underline"
      >
        {email}
      </a>
      {item.slice(match.index + email.length)}
    </>
  )
}

function SectionBody({ section, path }: { section: DocSection; path: number[] }) {
  const level = path.length
  const id = `sec-${path.join('-')}`
  const number = path.join('.')

  return (
    <section id={id} className="scroll-mt-24">
      {level === 1 ? (
        <h2 className="flex items-baseline gap-2 text-lg font-semibold text-slate-800">
          <span className="shrink-0 tabular-nums text-blue-600">{number}</span>
          {section.heading}
        </h2>
      ) : (
        <h3 className="flex items-baseline gap-2 text-base font-semibold text-slate-800">
          <span className="shrink-0 tabular-nums text-blue-500">{number}</span>
          {section.heading}
        </h3>
      )}

      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="mt-2 text-sm leading-7 text-slate-600">
          {paragraph}
        </p>
      ))}

      {section.list && (
        <ul className="mt-2 space-y-1.5">
          {section.list.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-6 text-slate-600">
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden />
              {withLink(item)}
            </li>
          ))}
        </ul>
      )}

      {section.table && (
        <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-700">
                {section.table.headers.map((header) => (
                  <th
                    key={header}
                    className="whitespace-nowrap border-b border-slate-200 px-3.5 py-2.5 font-medium"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="even:bg-slate-50/60">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="whitespace-pre-line border-b border-slate-100 px-3.5 py-2 text-slate-600 last:border-b-0"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section.children && (
        <div className="mt-6 space-y-6">
          {section.children.map((child, index) => (
            <SectionBody key={index} section={child} path={[...path, index + 1]} />
          ))}
        </div>
      )}
    </section>
  )
}

/**
 * 通用知识库页面：
 * 根据当前路径从 pageContents 读取内容，渲染为带章节编号的阅读页 + 右侧锚点目录。
 */
export default function SectionPage() {
  const { pathname } = useLocation()
  const key = pathname.replace(/^\//, '')
  const content = pageContents[key]

  const toc = useMemo<TocItem[]>(
    () => (content ? collect(content.sections, [], []) : []),
    [content],
  )

  if (!content) return <NotFound />

  return (
    <ReadingLayout title={content.title} lead={content.lead} meta={content.meta} toc={toc}>
      {content.sections.map((section, index) => (
        <div key={index} className={index === 0 ? '' : 'mt-8'}>
          <SectionBody section={section} path={[index + 1]} />
        </div>
      ))}
    </ReadingLayout>
  )
}
