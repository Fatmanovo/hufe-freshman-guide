import { useEffect, useState } from 'react'
import { Info } from 'lucide-react'

interface DisclaimerModalProps {
  open: boolean
  onClose: () => void
}

/** 渐入渐出动画时长（与 CSS transition 一致） */
const TRANSITION_MS = 200

/** 进入网站时的免责声明弹窗（带渐入渐出动画） */
export default function DisclaimerModal({ open, onClose }: DisclaimerModalProps) {
  // render 控制元素是否保留在 DOM 中；show 控制透明度，实现渐入渐出
  const [render, setRender] = useState(open)
  const [show, setShow] = useState(false)

  useEffect(() => {
    let raf: number | undefined
    let timer: number | undefined

    if (open) {
      setRender(true)
      // 先以透明渲染一帧，再切换为不透明，触发渐入
      raf = requestAnimationFrame(() => setShow(true))
    } else {
      setShow(false)
      // 渐出动画结束后再移除元素
      timer = window.setTimeout(() => setRender(false), TRANSITION_MS)
    }

    return () => {
      if (raf !== undefined) cancelAnimationFrame(raf)
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [open])

  if (!render) return null

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-200 ${
        show ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="免责声明"
    >
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden />

      {/* 弹窗卡片 */}
      <div
        className={`relative w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-lg transition-transform duration-200 ${
          show ? 'scale-100' : 'scale-[0.97]'
        }`}
      >
        <div className="flex items-center gap-2">
          <Info size={18} className="shrink-0 text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-800">免责声明</h2>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-600">
          本网站为<b>在校学生自制</b>的新生入学指南，<b>并非学校官方发布</b>
          ，内容仅供参考。
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          报到、收费、学籍等重要事项，请以湖南财政经济学院官方网站（
          <a
            href="https://www.hufe.edu.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline-offset-2 hover:underline"
          >
            https://www.hufe.edu.cn/
          </a>
          ）及学校官方通知为准。
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          如有疑问、建议或发现信息有误，可发送邮件至{' '}
          <a
            href="mailto:sk060@foxmail.com"
            className="text-blue-600 underline-offset-2 hover:underline"
          >
            sk060@foxmail.com
          </a>
          。
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          我已了解
        </button>
      </div>
    </div>
  )
}
