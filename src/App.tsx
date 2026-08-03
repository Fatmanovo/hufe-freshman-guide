import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import CampusLife from './pages/CampusLife'
import CampusMap from './pages/CampusMap'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import PracticalInfo from './pages/PracticalInfo'
import Registration from './pages/Registration'
import SectionPage from './pages/SectionPage'
import StudyGuide from './pages/StudyGuide'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="registration" element={<Registration />} />
        <Route path="registration/:section" element={<SectionPage />} />
        <Route path="campus/:section" element={<CampusLife />} />
        <Route path="study/:section" element={<StudyGuide />} />
        <Route path="info/:section" element={<PracticalInfo />} />
        {/* 校区总览使用地图模块，教学楼/生活设施走通用文档页 */}
        <Route path="map/overview" element={<CampusMap />} />
        <Route path="map/:section" element={<SectionPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
