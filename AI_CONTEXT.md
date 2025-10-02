# AI 上下文文档

## 项目概述
这是一个基于 Next.js 15 的现代化博客项目，名为 "boke"。

## 技术栈
- **框架**: Next.js 15 + React 19 + TypeScript
- **样式**: Tailwind CSS + UnoCSS
- **状态管理**: Zustand
- **字体**: Geist Sans + Geist Mono
- **工具库**: clsx, lodash

## 项目结构
```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── ui/page.tsx        # UI演练场（客户端组件）
│   ├── layout.tsx         # 根布局
│   └── globals.css        # 全局样式
├── components/            # 组件库
│   ├── Button/           # 按钮组件
│   ├── Menu/             # 菜单组件
│   │   ├── RecursiveMenu.tsx  # 递归菜单组件
│   │   └── index.ts      # 菜单组件导出
│   ├── Layout.tsx        # 布局组件
│   ├── Header.tsx        # 头部组件
│   └── Footer.tsx        # 底部组件
└── utils/
    └── cn.ts             # 类名合并工具
```

## 开发约定

### 1. 代码风格
- 使用中文注释和界面文本
- 组件使用 TypeScript 严格类型
- 使用 `cn` 工具函数合并类名
- 客户端组件需要添加 `'use client'` 指令
- **函数注释**：使用 `/** */` 格式，简洁明了
- **HTML 分块注释**：为每个主要区块添加功能说明注释

### 2. 组件规范
- 所有组件都支持 `className` 属性
- 使用 `React.forwardRef` 包装需要 ref 的组件
- 组件接口使用 `interface` 定义
- 导出组件时设置 `displayName`

### 3. 样式规范
- 优先使用 Tailwind CSS 类名
- 使用 UnoCSS 的 shortcuts 功能
- 响应式设计使用 Tailwind 的断点前缀
- 颜色主题使用紫色系（purple-500, purple-600 等）

### 4. 文件命名
- 组件文件使用 PascalCase
- 工具文件使用 camelCase
- 页面文件使用 kebab-case

## 当前状态
- 基础布局已完成（Header, Footer, Layout）
- Button 组件已完善，支持 6 种变体和 5 种尺寸
- UI 演练场页面已创建并展示所有 Button 功能
- 字体配置已统一为 Geist
- 已修复水合错误和客户端组件问题

## Button 组件功能
- **变体**: primary, secondary, outline, ghost, text, destructive
- **尺寸**: xs, sm, md, lg, xl
- **功能**: loading 状态, 左右图标支持, 禁用状态
- **样式**: 渐变背景, 阴影效果, 悬停动画, 点击缩放效果
- **交互**: cursor-pointer, active:scale-95 触摸反馈
- **注释**: 所有 props 都有完整的 JSDoc 注释

## 博客系统架构
- **分类系统**: 基于 JSON 配置的层级分类结构
- **标签系统**: MD 文件前置元数据中的标签字段
- **路由生成**: 根据分类 JSON 自动生成页面路由
- **内容管理**: MD 文件存储在 `/src/content/blog/` 目录
- **元数据格式**: 包含 title, description, createdAt, updatedAt, tags, category, featured

## 分类配置
- **配置文件**: `/src/config/categories.ts` - TypeScript 配置文件
- **数据结构**: 数组形式，每个分类是独立的对象
- **类型安全**: 使用 TypeScript 接口定义 Category 类型
- **层级关系**: 通过 level、parentId、children 字段管理层级
- **一级分类**: 前端、后端、计网、数据结构与算法、计算机操作系统、计算机组成原理、设计模式
- **二级分类**: 每个一级分类下的具体技术栈
- **标签匹配**: 通过 tags 字段将 MD 文件关联到对应分类
- **工具函数**: 提供 getCategoryById、getCategoriesByLevel 等工具函数
- **灵活调整**: 可随时修改 TypeScript 配置来调整分类结构

## 示例内容
- Vue 3 Composition API 指南 (vue, vue3, composition-api)
- React Hooks 设计模式 (react, hooks, patterns)
- LeetCode 两数之和 (leetcode, algorithm, hash-table)
- HTTP 协议深度解析 (http, https, http2, http3)

## 博客系统功能
- **博客首页** (`/blog`): 三栏布局，左侧分类导航，中间内容区域，右侧目录导航
- **URL 同步**: 通过查询参数 `?article=vue` 访问特定文章，支持直接链接访问
- **单页面应用**: 无页面刷新切换文章，避免闪烁问题
- **分类页面** (`/blog/[category]`): 展示一级分类下的子分类列表
- **子分类页面** (`/blog/[category]/[subcategory]`): 展示具体子分类的文章列表
- **文章详情页** (`/blog/post/[slug]`): 文章内容展示，包含相关文章推荐
- **标签系统**: 通过标签匹配文章到对应分类
- **响应式设计**: 支持移动端和桌面端
- **面包屑导航**: 清晰的页面层级导航
- **导航交互**: 点击父节点展开/收起，点击子节点切换文章内容
- **状态保持**: 文章页面保持三栏布局，左侧导航自动展开对应分类

## 路由结构
- `/blog` - 博客首页
- `/blog?article=vue` - Vue 文章（通过查询参数）
- `/blog?article=react` - React 文章
- `/blog?article=algorithm` - 算法文章
- `/blog?article=network` - 网络文章
- `/blog/frontend` - 前端分类
- `/blog/frontend/vue` - Vue 子分类
- `/blog/post/vue3-composition-api-guide` - 具体文章

## 组件库

### Button 组件
- 6种变体：primary, secondary, outline, ghost, text, destructive
- 5种尺寸：xs, sm, md, lg, xl
- 支持图标、加载状态、禁用状态
- 完整的 TypeScript 类型定义

### Menu 组件
- **RecursiveMenu**: 递归菜单组件
- 支持无限层级的菜单结构
- 类似 Ant Design Menu 的效果
- 支持展开/收起、选中状态
- 自动根据当前选中项展开父级

## 待完善功能
- 其他 UI 组件（Input, Card, Modal 等）
- 文档系统
- 搜索功能
- 标签页面

## 注意事项
- 已修复水合错误（字体配置统一）
- UI 演练场页面已标记为客户端组件
- 所有交互功能需要在客户端组件中实现
