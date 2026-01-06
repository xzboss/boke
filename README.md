# ----

基于 Next.js 16 开发的现代化个人博客

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## ✨ 功能特性

- 📝 **Markdown 支持**：完整的 GFM + 数学公式 + 代码高亮
- 📁 **目录结构**：支持嵌套分类，自动生成菜单树
- 🔄 **自动元数据**：创建/更新时间自动维护，内容变更检测
- 🎨 **主题系统**：支持亮色/暗色主题切换，并且支持多色调
- ⚡ **静态生成**：SSG 部署，CDN 友好，性能卓越

## 🏗️ 项目结构

```
详细架构见AI_CONTEXT.md
```

## 📦 技术栈

- **Framework**: Next.js 16 (App Router)
- **Styling**: UnoCSS + Tailwind CSS
- **Content**: Markdown + Gray Matter
- **Math**: KaTeX
- **Icons**: Ant Design Icons
- **Deployment**: Vercel

## 🚀 部署

### Vercel 部署

1. 连接 GitHub 仓库
2. 自动检测 Next.js 项目
3. 一键部署完成

### 手动部署

```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

## 📝 写作规范

1. 博客文件放置在 `src/content/blogs/` 目录
2. 支持嵌套目录结构，自动生成导航菜单
3. 使用标准 Markdown 语法
4. 自动维护YAML元数据