# 新生指南 · 湖南财政经济学院新生入学指南网站

面向大学新生的校园服务导航网站，参考中国高校官方网站 / 校园信息门户 / 教务系统的设计风格，以「简洁、清晰、高效、信息优先」为原则。内容依据《湖南财政经济学院新生入学须知》整理。

## 技术栈

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Lucide React（图标）

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:5173 即可访问。

## 项目结构

```
src
├── components
│   ├── Sidebar.tsx      # 左侧固定导航菜单（240px，支持展开/收起）
│   ├── Header.tsx       # 顶栏（面包屑 + 页面标题 + 搜索框，吸顶）
│   ├── ReadingLayout.tsx# 知识库阅读布局（标题 + 导读 + 右侧目录）
│   ├── AnchorTOC.tsx    # 右侧锚点目录（滚动高亮 + 点击跳转）
│   ├── Timeline.tsx     # 报到流程时间轴
│   ├── MapContainer.tsx # 校园地图占位容器（预留 Mapbox/MapLibre/Cesium）
│   └── Layout.tsx       # 整体布局（侧栏固定，整页滚动）
├── pages
│   ├── Home.tsx             # 首页
│   ├── Registration.tsx     # 报到流程
│   ├── CampusLife.tsx       # 校园生活分组页
│   ├── StudyGuide.tsx       # 学习指南分组页
│   ├── CampusMap.tsx        # 校园地图（校区总览）
│   ├── PracticalInfo.tsx    # 实用信息分组页
│   ├── SectionPage.tsx      # 通用文档页（数据驱动）
│   └── NotFound.tsx
├── data
│   ├── menu.ts   # 左侧菜单配置
│   └── pages.ts  # 各文档页正文内容
```

## 如何扩展

- **新增菜单/页面**：在 `src/data/menu.ts` 添加菜单项 → 在 `src/data/pages.ts` 按路径键补充正文 → 路由自动命中通用文档页（或单独编写页面并在 `src/App.tsx` 注册）。
- **接入真实地图**：替换 `MapContainer.tsx` 占位内容，可接入 Mapbox / MapLibre / Cesium 及校园三维地图。
- **更新内容**：学校名称、联系电话、校历等均为新生入学须知内容，集中在 `src/data` 中修改。

## 视觉规范

- 主色 `#2563EB`，背景 `#F8FAFC`，正文 `#1E293B`，辅助文字 `#64748B`，边框 `#E5E7EB`
- 字体：思源黑体 / Inter（缺失时回退系统黑体）
- 圆角 8px，轻微阴影，无大面积渐变与动画
