export interface TimelineStep {
  /** 锚点 id，用于右侧目录定位 */
  id?: string
  title: string
  description: string
}

interface TimelineProps {
  steps: TimelineStep[]
}

/**
 * 报到流程时间轴：
 * 左侧蓝色圆形编号，右侧标题 + 描述，步骤之间用竖线连接。
 */
export default function Timeline({ steps }: TimelineProps) {
  return (
    <ol>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        return (
          <li key={step.title} id={step.id} className="relative flex scroll-mt-24 gap-4 pb-8 last:pb-0">
            {/* 连接线 */}
            {!isLast && (
              <span
                aria-hidden
                className="absolute left-[15px] top-8 bottom-0 w-px bg-slate-200"
              />
            )}
            {/* 编号圆点 */}
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {index + 1}
            </div>
            {/* 标题与描述 */}
            <div className="min-w-0 pt-1">
              <h3 className="text-sm font-semibold text-slate-800">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{step.description}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
