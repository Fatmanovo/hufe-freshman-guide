# 部署到 GitHub Pages

项目已配置好一键部署：**push 到 `main` 分支后，GitHub Actions 自动构建并发布**，无需手动处理构建产物。

## 1. 创建 GitHub 仓库

1. 打开 https://github.com/new
2. 仓库名填写项目名（例如 `freshman-guide`）
3. 可见性选择 **Public**（GitHub Pages 免费版仅支持公开仓库）
4. 不要勾选「Add a README」「.gitignore」等初始化选项（本机已有），直接创建

## 2. 上传代码

在本地项目目录执行：

```bash
git init
git add .
git commit -m "init: 新生指南网站"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

> 部署路径 `base` 由 GitHub Actions 自动按仓库名注入（`BASE_PATH=/<仓库名>/`），无需手动修改 `vite.config.ts`。

## 3. 开启 Pages

1. 进入仓库 → **Settings** → 左侧 **Pages**
2. **Build and deployment** → **Source** 选择 **Deploy from a branch**
3. **Branch** 选择 **gh-pages**，目录 **/ (root)**，点击 **Save**
4. （首次约 1 分钟后生效）

> Actions 会把构建产物推送到 `gh-pages` 分支，Pages 从该分支发布。

## 4. 查看 Actions

1. 进入仓库 → **Actions** 标签页
2. 查看 **Deploy to GitHub Pages** 工作流运行状态
3. 绿色 ✓ 表示构建部署成功；红色 ✗ 可点进去查看日志排错

## 5. 获取访问地址

部署完成后，访问地址格式为：

```
https://<你的用户名>.github.io/<仓库名>/
```

例如用户名 `sk060`、仓库 `freshman-guide`：

```
https://sk060.github.io/freshman-guide/
```

## 后续如何更新网站

改完代码后正常提交推送即可，无需手动构建：

```bash
git add .
git commit -m "更新内容"
git push
```

push 到 `main` 分支后，Actions 会自动重新构建并发布到 GitHub Pages（约 1-2 分钟生效）。

## 注意事项

- **路由**：站点使用 HashRouter（`/#/xxx`），任意页面刷新/直达均正常；`public/404.html` 负责处理旧的无 hash 路径直达
- **静态资源**：logo、360 全景均使用相对路径，`base` 由工作流自动注入，部署后图片与全景资源路径正常
- **仓库改名**：若之后重命名仓库，下一次 push 会自动按新仓库名构建，访问地址同步变化
