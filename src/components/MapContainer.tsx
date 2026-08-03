import { MapPin } from 'lucide-react'

interface MapContainerProps {
  title?: string
  description?: string
}

/**
 * 校园地图容器（占位模块）。
 * 后续接入地图引擎时，仅需替换占位内容：
 * - Mapbox GL / MapLibre GL：加载矢量瓦片，支持标记与图层
 * - Cesium：可接入校园三维模型与室内导航
 */
export default function MapContainer({
  title = '校区地图',
  description = '地图加载中，请稍后查看。',
}: MapContainerProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
        </div>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-500">地图模块</span>
      </div>
      <div className="flex h-[420px] items-center justify-center bg-slate-50">
        <div className="text-center">
          <MapPin size={44} className="mx-auto text-slate-300" />
          <p className="mt-4 text-sm text-slate-500">校园地图模块预留区域</p>
          <p className="mt-1 text-xs text-slate-400">
            后续可接入 Mapbox / MapLibre / Cesium 等地图引擎
          </p>
        </div>
      </div>
    </div>
  )
}
