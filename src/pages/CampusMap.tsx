import { ExternalLink } from 'lucide-react'

/**
 * 主校区两个 360° 全景视角：
 * - 空中视角：720yun 提供的校园空中全景
 * - 地面视角：Marzipano 制作的地面全景漫游（可切换多处场景）
 * 点击卡片在新标签页打开完整街景。
 */
const panoramas = [
  {
    title: '主校区 · 空中街景',
    desc: '720yun 提供的校园空中全景，从空中俯瞰主校区整体布局与周边环境。',
    badge: '720yun 全景',
    footLabel: '360° 全景街景',
    href: 'https://www.720yun.com/t/dbvkOb1y7fw?scene_id=58900188',
  },
  {
    title: '主校区 · 地面街景',
    desc: '在校学生制作的地面全景漫游，可切换实验楼、图书馆、西门、二食堂等多处场景。',
    badge: '在校学生制作',
    footLabel: '本校学生制作',
    href: '3602/index.html',
  },
]

export default function CampusMap() {
  return (
    <div className="max-w-5xl">
      <h2 className="text-lg font-semibold text-slate-800">校园全景</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        主校区提供空中与地面两个 360° 全景视角，点击卡片即可进入街景。
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {panoramas.map((item) => (
          <a
            key={item.title}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors hover:border-blue-600"
          >
            {/* 视觉区 */}
            <div className="flex h-52 shrink-0 items-center justify-center bg-blue-50">
              <div className="text-center text-blue-600">
                <div className="text-5xl font-bold tracking-tight">360°</div>
                <div className="mt-1.5 text-xs text-blue-400">{item.badge}</div>
              </div>
            </div>

            {/* 标题与描述 */}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-base font-semibold text-slate-800">{item.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">{item.desc}</p>
            </div>

            {/* 底部入口 */}
            <div className="flex shrink-0 items-center justify-between border-t border-slate-100 px-5 py-3">
              <span className="text-xs text-slate-400">{item.footLabel}</span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-blue-600">
                进入街景
                <ExternalLink
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
