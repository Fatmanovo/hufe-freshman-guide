import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  ClipboardList,
  Globe,
  Home,
  Info,
  Map,
  School,
} from 'lucide-react'

export interface MenuItem {
  /** 菜单显示名称 */
  title: string
  /** 内部跳转路径，无 path 的为分组菜单 */
  path?: string
  /** 外部链接（如学校官网），设置后点击在新标签页打开 */
  href?: string
  /** 菜单图标 */
  icon?: LucideIcon
  /** 子菜单 */
  children?: MenuItem[]
}

/**
 * 左侧导航菜单配置。
 * 新增菜单项只需在此处添加，侧边栏与面包屑会自动联动。
 * 内容依据《湖南财政经济学院新生入学须知》整理。
 */
export const menu: MenuItem[] = [
  { title: '首页', path: '/', icon: Home },
  {
    title: '报到准备',
    icon: ClipboardList,
    children: [
      { title: '报到流程', path: '/registration' },
      { title: '所需材料', path: '/registration/materials' },
      { title: '银行卡办理', path: '/registration/bank' },
      { title: '费用说明', path: '/registration/fees' },
      { title: '资助政策', path: '/registration/aid' },
      { title: '常见问题', path: '/registration/faq' },
    ],
  },
  {
    title: '校园生活',
    icon: School,
    children: [
      { title: '宿舍生活', path: '/campus/dorm' },
      { title: '食堂指南', path: '/campus/canteen' },
      { title: '校园卡使用', path: '/campus/card' },
      { title: '校内交通', path: '/campus/transport' },
    ],
  },
  {
    title: '学习指南',
    icon: BookOpen,
    children: [
      { title: '转专业', path: '/study/major' },
      { title: '安全教育', path: '/study/safety' },
    ],
  },
  {
    title: '校园地图',
    icon: Map,
    children: [
      { title: '校区总览', path: '/map/overview' },
      { title: '生活设施', path: '/map/facilities' },
    ],
  },
  {
    title: '实用信息',
    icon: Info,
    children: [
      { title: '联系方式', path: '/info/contact' },
      { title: '校历安排', path: '/info/calendar' },
      { title: '应征入伍', path: '/info/military' },
      { title: '通知公告', path: '/info/announcements' },
    ],
  },
  { title: '学校官网', href: 'https://www.hufe.edu.cn/', icon: Globe },
]
