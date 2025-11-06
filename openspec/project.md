# 项目上下文

## 目的
这是一个基于 Next.js 15 的现代化博客系统，采用高性能静态站点生成技术。项目目标是提供快速、美观、易用的博客阅读和管理体验，实现完整的博客功能栈，包括文章管理、分类导航、主题切换等核心功能。系统采用面向对象的架构设计，确保代码的可维护性和扩展性。

## 技术栈
- **框架**: Next.js 15 (App Router) + React 19 + TypeScript 5.x
- **样式系统**: Tailwind CSS v4 + UnoCSS
- **状态管理**: Zustand (持久化到 localStorage)
- **Markdown 处理**: remark + rehype + gray-matter + dayjs
- **字体**: Geist Sans + Geist Mono
- **图标**: @ant-design/icons (Iconfont)
- **工具库**: clsx, tailwind-merge, lodash
- **数学公式**: KaTeX (remark-math + rehype-katex)
- **构建工具**: Turbopack (Next.js 内置)

## 项目约定

### 代码风格
- **组件命名**: PascalCase (Button.tsx, RecursiveMenu.tsx)
- **工具函数**: camelCase (generateSlug, cn, withAlpha)
- **页面文件**: kebab-case (动态路由文件夹)
- **类型定义**: PascalCase (BlogItem, MenuNode, CatalogNode)
- **客户端组件**: 添加 'use client' 指令
- **Props 传递**: 支持 className, style, {...props} 透传
- **按钮统一**: 必须使用公共 Button 组件，不自定义按钮样式

### 架构模式
- **面向对象设计**: 核心 Blog 类统一管理数据和逻辑
- **职责分离**: loader(数据加载) + processor(Markdown处理)
- **树形数据结构**: MenuNode/CatalogNode 直接引用 parent/children
- **序列化安全**: 服务端预处理，客户端纯对象传递
- **SSG 优化**: 构建时预处理，运行时零 API 调用

### 测试策略
- **单元测试**: 组件和工具函数的基础功能测试
- **集成测试**: 前后端数据流和交互逻辑测试
- **E2E 测试**: 用户完整操作流程测试
- **覆盖目标**: 核心业务逻辑 80%+ 覆盖率

### Git 工作流
- **主分支**: main (生产环境)
- **开发分支**: dev-* (功能开发分支)
- **提交规范**: 动词主导 + 简洁描述
- **PR 流程**: 功能完成 → 创建 PR → 代码审查 → 合并
- **标签管理**: v0.0.0, v0.1.0 等语义化版本

## 领域上下文
这是一个技术博客系统，专注于前端和后端技术文章的展示和管理。系统支持 Markdown 格式的文章内容，包括代码块、数学公式、表格等富媒体元素。文章通过标签进行分类，支持多级菜单导航。系统采用三栏布局：左侧分类菜单、中间文章内容、右侧文章目录。支持主题切换(明暗模式)和多色调选择，提供完整的阅读和导航体验。

## 重要约束
- **假数据限制**: 生成的测试数据不能使用真实博客相关字眼，可用英文或拼音替代
- **主题样式限制**: 禁止使用 :dark 类名，所有主题逻辑使用 CSS 变量和三元表达式
- **组件统一性**: 所有按钮必须使用公共 Button 组件，不允许自定义按钮样式
- **文字样式限制**: 不处理文字的字体、大小、颜色等样式，由 UnoCSS 统一管理
- **性能要求**: 文章加载时间 <10ms，采用 SSG 静态生成
- **可访问性**: 支持键盘导航、ARIA 属性、语义化 HTML

## 外部依赖
- **Iconfont**: @ant-design/icons CDN 服务 (iconfont.cn)
- **字体服务**: Google Fonts (Geist Sans/Mono)
- **包管理**: npm registry
- **构建环境**: Node.js 18+ 支持
