import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import DisclaimerModal from './DisclaimerModal'
import Header from './Header'
import Sidebar from './Sidebar'

/**
 * 整体布局：侧栏固定，顶栏吸顶，内容区随页面整体滚动。
 * 桌面端侧栏常驻；移动端侧栏收为抽屉，通过顶栏汉堡按钮唤出。
 * 每次进入网站时展示免责声明弹窗。
 */
export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [disclaimerOpen, setDisclaimerOpen] = useState(true)
  const { pathname } = useLocation()

  // 路由变化时关闭移动端抽屉
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // 抽屉或免责弹窗打开时锁定背景滚动
  useEffect(() => {
    document.body.style.overflow = menuOpen || disclaimerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, disclaimerOpen])

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 移动端抽屉遮罩 */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}

      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="min-h-screen lg:ml-60">
        <Header onMenuClick={() => setMenuOpen(true)} />
        <main className="px-4 py-5 sm:px-8 sm:py-6">
          <Outlet />
        </main>
      </div>

      {/* 进入网站时的免责声明弹窗 */}
      <DisclaimerModal open={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} />
    </div>
  )
}
