import { Link } from 'react-router-dom'
import { ArrowRight, Bell, CreditCard, ExternalLink, Map, Route, ShieldCheck } from 'lucide-react'

const quickLinks = [
  { title: '报到流程', desc: '报到时间与网上报到 10 步流程', path: '/registration', icon: Route },
  { title: '校园地图', desc: '主校区与雷锋校区位置分布', path: '/map/overview', icon: Map },
  { title: '校园卡使用', desc: '充值、挂失与业务办理指南', path: '/campus/card', icon: CreditCard },
  { title: '安全教育', desc: '必修课程与反诈提醒', path: '/study/safety', icon: ShieldCheck },
]

const notices = [
  { title: '新生报到时间安排', date: '9 月 2 日' },
  { title: '新生安全教育必修课程通知', date: '8 月 18 日' },
  { title: '校园卡办理与充值说明', date: '8 月 15 日' },
  { title: '湖南银行新生银行卡开卡指引', date: '8 月 12 日' },
  { title: '新生入学须知', date: '8 月 10 日' },
]

export default function Home() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* 欢迎区域 */}
      <section className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-800">欢迎新同学！</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          这里是湖南财政经济学院新生入学指南，帮助你快速了解报到流程与校园生活。
        </p>
        <a
          href="https://www.hufe.edu.cn/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
        >
          访问学校官网
          <ExternalLink size={14} />
        </a>
      </section>

      {/* 快速入口 */}
      <section>
        <h3 className="mb-4 text-base font-semibold text-slate-800">快速入口</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="group rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-blue-600"
            >
              <item.icon size={22} className="text-blue-600" />
              <div className="mt-3 text-sm font-semibold text-slate-800">{item.title}</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                查看详情 <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 通知公告 */}
      <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
        <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-800">
          <Bell size={16} className="text-blue-600" />
          通知公告
        </h3>
        <ul className="divide-y divide-slate-100">
          {notices.map((notice) => (
            <li
              key={notice.title}
              className="-mx-2 flex items-center justify-between gap-4 rounded-md px-2 py-3 transition-colors hover:bg-slate-50"
            >
              <span className="min-w-0 truncate text-sm text-slate-700">{notice.title}</span>
              <span className="shrink-0 text-xs text-slate-400">{notice.date}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
