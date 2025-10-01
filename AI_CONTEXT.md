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

## 待完善功能
- 其他 UI 组件（Input, Card, Modal 等）
- 博客功能模块
- 文档系统

## 注意事项
- 已修复水合错误（字体配置统一）
- UI 演练场页面已标记为客户端组件
- 所有交互功能需要在客户端组件中实现
